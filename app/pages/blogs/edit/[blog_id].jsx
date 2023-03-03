import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { resizeImage } from '../../../utils/imageResizer';
import RichTextEditor from '../../../components/Blog/RichTextEditor';

const EditBlogPage = () => {
  const profileSlice = useSelector((state) => state.profileSlice);

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [blogData, setBlogData] = useState({
    title: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [content, setContent] = useState('');

  const fetchBlog = async (id) => {
    try {
      const { data } = await axios.get(`/blogs/${id}`);
      setBlogData({
        title: data.blog.title,
        image: '',
      });
      setContent(data.blog.content);
      setImagePreview(data.blog.blog_url);
    } catch (e) {
      toast.error(e.response?.data.msg);
    }
  };

  useEffect(() => {
    if (router.query.blog_id) {
      fetchBlog(router.query.blog_id);
    }
  }, [router.query.blog_id]);

  const editBlog = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.patch(
        `/blogs/${router.query.blog_id}/update`,
        { ...blogData, content }
      );
      toast(data.msg);
      if (data.url) {
        setImagePreview(data.url);
      }
      setBlogData({
        ...blogData,
        image: '',
      });
    } catch (err) {
      toast.error(err.response.data.msg);
    }
    setIsLoading(false);
  };

  const titleChange = (e) => {
    setBlogData({
      ...blogData,
      title: e.target.value,
    });
  };

  const imageChange = async (e) => {
    const file = e.target.files[0];
    setImagePreview(URL.createObjectURL(file));
    const base64 = await resizeImage(file);
    setBlogData({
      ...blogData,
      image: base64,
    });
  };

  return (
    <>
      <Head>
        <title>Edit Blog | {profileSlice.role} | GlobalPal</title>
        <meta name="description" content="GlobalPal Service" />
      </Head>
      <Container>
        <div
          className="px-5 mt-3 bg-light rounded-2 mx-5 py-5 border border-warning"
          style={{
            height: '45rem',
            overflowY: 'scroll',
          }}
        >
          <h2>edit blog</h2>
          <hr />
          <div className="mb-2">
            <span>Title</span>
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              onChange={titleChange}
              value={blogData.title}
            />
          </div>
          <div className="mb-3">
            <span>Picture</span>
            <input
              type="file"
              className="form-control w-50"
              accept="image/*"
              onChange={imageChange}
            />
            <div>
              <img
                src={imagePreview}
                style={{
                  width: '550px',
                  height: '320px',
                  objectFit: 'cover',
                }}
                alt="..."
              />
            </div>
          </div>
          <div className="mb-3">
            <span>Content</span>
            <RichTextEditor content={content} setContent={setContent} />
          </div>
          <div className="text-end">
            <button
              className="btn btn-outline-primary px-5"
              onClick={editBlog}
              disabled={isLoading}
            >
              {isLoading ? 'Editing..' : 'Edit'}
            </button>
          </div>
        </div>
      </Container>
    </>
  );
};

export default EditBlogPage;
