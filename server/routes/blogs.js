const { Router } = require('express');
const router = Router();
const {
  createBlog,
  delBlogs,
  updateBlogs,
  getBlog,
  getMyBlog,
  getRelateBlog,
  getRecommendBlog,
  increaseBlogViews,
} = require('../controllers/blogs');
const { doctorAuthorization } = require('../middleware/authorization');

// Routes
// /api/blogs/create building blogs
router.post('/create', doctorAuthorization, createBlog);

// /api/blogs/my-blogs Submit all blogs created by me
router.get('/my-blogs', doctorAuthorization, getMyBlog);

// /api/blogs/:id send block data
router.get('/:id', getBlog);

// /api/blogs/:id/update Edit blogs information
router.patch('/:id/update', doctorAuthorization, updateBlogs);

// /api/blogs/:id delete blog
router.delete('/:id', doctorAuthorization, delBlogs);

// /api/blogs/topics/:topic_id/related-blogs Sends 5 blogs contained in the selected topic to you.
router.get('/topics/:topic_id/related-blogs', getRelateBlog);

// /api/blogs/recommended/latest send 3 blogs, sort by creation time high-low
router.get('/recommended/latest', getRecommendBlog);

router.patch('/:id/increase/views', increaseBlogViews);

module.exports = router;
