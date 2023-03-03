const { connection } = require('../sql/mysql');
const { v4 } = require('uuid');

const cloudinary = require('cloudinary');

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

const createBlog = async (req, res) => {
  const blog_userId = req.user.userId;
  const blog_topicId = req.body.selectedTopicId;
  const blog_title = req.body.title;
  const blog_content = req.body.content;
  const image = req.body.image;

  try {
    const blog_id = v4();
    const uploadApiResponse = await cloudinary.v2.uploader.upload(image, {
      // public_id: uuidv4(), duplicate images
      resource_type: 'image',
      folder: 'globalHealth/blog-image',
    });
    if (!uploadApiResponse) {
      return res.status(400).json({ msg: 'Could not upload profile image' });
    }
    const image_id = uploadApiResponse.public_id;
    const url = uploadApiResponse.url;

    const q = `
        INSERT INTO blogs (id, title, content, views, topic_id, user_id) 
        VALUES ("${blog_id}", "${blog_title}", ?, DEFAULT, "${blog_topicId}", "${blog_userId}")
    `;

    await connection.query(q, [blog_content]);

    const q2 = `
        INSERT INTO blog_images (blog_id, url, image_id)
        VALUES ("${blog_id}", "${url}", "${image_id}")
        `;
    await connection.query(q2);

    const q3 = `
        SELECT user_id FROM interested_in
        WHERE topic_id = "${blog_topicId}" AND user_id!="${blog_userId}"
      `;
    const notificationUserId = await connection.query(q3);

    for (let i = 0; i < notificationUserId.length; i++) {
      const queryNotification = `
        INSERT INTO notifications (id,type,blog_id,user_id) 
        VALUES ("${v4()}", "BLOG","${blog_id}","${
        notificationUserId[i].user_id
      }")
        `;
      await connection.query(queryNotification);
      await connection.query(
        'UPDATE users SET unread_notification = unread_notification+1 WHERE id=?',
        [notificationUserId[i].user_id]
      );
    }

    res.status(200).json({ msg: 'created successfully' });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

const delBlogs = async (req, res) => {
  const id_blog = req.params.id;
  try {
    const q = `
      SELECT image_id
      FROM blog_images
      WHERE blog_id = "${id_blog}"
`;
    const [image] = await connection.query(q);
    await cloudinary.v2.uploader.destroy(image.image_id);

    await connection.query('DELETE FROM notifications WHERE blog_id=?', [
      id_blog,
    ]);
    const queryBlogImage = `
      DELETE from blog_images
      WHERE blog_images.blog_id = "${id_blog}"
`;
    await connection.query(queryBlogImage);
    const queryBlog = `
      DELETE from blogs
      WHERE blogs.id = "${id_blog}"
`;
    await connection.query(queryBlog);
    res.status(200).json({ msg: 'deleted successfully' });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

const updateBlogs = async (req, res) => {
  const id_blog = req.params.id;
  const blog_title = req.body.title;
  const blog_content = req.body.content;
  const image = req.body.image;

  try {
    let cloud_image = {};
    if (image) {
      const q = `
        SELECT image_id
        FROM blog_images
        WHERE blog_id = "${id_blog}"
    `;
      const [newImage] = await connection.query(q);
      await cloudinary.v2.uploader.destroy(newImage.image_id);

      cloud_image = await cloudinary.v2.uploader.upload(image, {
        public_id: newImage.image_id,
      });

      const queryblogimage = `
        UPDATE blog_images SET blog_images.url = "${cloud_image.url}" 
        WHERE blog_images.blog_id = "${id_blog}"
      `;
      await connection.query(queryblogimage);
    }
    const queryblog = `
        UPDATE blogs SET blogs.title = "${blog_title}", blogs.content = ?
        WHERE blogs.id = "${id_blog}"
      `;
    await connection.query(queryblog, [blog_content]);
    res
      .status(200)
      .json({ msg: 'updated successfully', url: cloud_image.url || '' });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

const getBlog = async (req, res) => {
  const id_blog = req.params.id;
  try {
    const queryblog = `
    SELECT blogs.id, blogs.title, blogs.content, blog_images.url as blog_url, 
    topic, topics.id as topic_id, blogs.views, blogs.user_id as doctor_id, users.name, 
    profile_images.url as profile_url, blogs.created_at  
    FROM blogs, blog_images, users, profile_images, topics
    WHERE blogs.id = "${id_blog}" 
    AND blogs.id = blog_images.blog_id 
    AND blogs.user_id = profile_images.user_id
    AND blogs.user_id = users.id
    AND blogs.topic_id = topics.id
    `;
    const [blog] = await connection.query(queryblog);

    res.status(200).json({ blog });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

const getMyBlog = async (req, res) => {
  const blog_userId = req.user.userId;
  try {
    const queryblog = `
        SELECT blogs.id, blogs.title, blog_images.url, topics.topic, blogs.created_at
        FROM blogs, blog_images, topics
        WHERE blogs.user_id = "${blog_userId}"
        AND blogs.id = blog_images.blog_id 
        AND blogs.topic_id = topics.id
        ORDER BY created_at DESC
    `;
    const blogs = await connection.query(queryblog);
    res.status(200).json({ blogs });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

const getRelateBlog = async (req, res) => {
  const topic_id = req.params.topic_id;

  try {
    const queryblog = `
        SELECT  blogs.id, blogs.title, blog_images.url, topics.topic
        FROM  blogs, blog_images, topics
        WHERE blogs.topic_id = "${topic_id}" 
        AND blogs.topic_id = topics.id
        AND blogs.id = blog_images.blog_id    
        ORDER BY blogs.created_at desc LIMIT 5
    `;
    const blogs = await connection.query(queryblog);
    res.status(200).send({ blogs });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

const getRecommendBlog = async (req, res) => {
  try {
    const queryblog = `
        SELECT blogs.id, blogs.title, blogs.content, blog_images.url, topic, blogs.views, blogs.created_at
        FROM blogs, blog_images, topics
        WHERE blogs.id = blog_images.blog_id and blogs.topic_id = topics.id
        ORDER BY blogs.views desc 
        LIMIT 3
    `;
    const blogs = await connection.query(queryblog);
    res.status(200).send({ blogs });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

const increaseBlogViews = async (req, res) => {
  await connection.query(`
    UPDATE blogs SET views = views + 1 
    WHERE id="${req.params.id}"
    `);
  res.status(204).send({});
};
module.exports = {
  createBlog,
  delBlogs,
  updateBlogs,
  getBlog,
  getMyBlog,
  getRelateBlog,
  getRecommendBlog,
  increaseBlogViews,
};
