import axios from 'axios';
import Head from 'next/head';
import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import useEffectOnce from '../../hooks/useEffectOnce';
import MyBlogItem from '../../components/Blog/MyBlogItem';

const MyBlogsPage = () => {
  const profileSlice = useSelector((state) => state.profileSlice);
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get(`/blogs/my-blogs`);
      setBlogs(data.blogs);
    } catch (e) {
      toast.error(e.response?.data.msg);
    }
  };

  useEffectOnce(() => {
    fetchBlogs();
  });

  const deleteBlog = async (id) => {
    const answer = window.confirm('Would you like to delete this blog?');
    if (answer) {
      try {
        const { data } = await axios.delete(`/blogs/${id}`);
        toast(data.msg);
        const filtered = blogs.filter((blog) => blog.id !== id);
        setBlogs(filtered);
      } catch (err) {
        toast.error(err.response.data.msg);
      }
    }
  };
  return (
    <>
      <Head>
        <title>Create Blog | {profileSlice.role} | GlobalPal</title>
        <meta name="description" content="GlobalPal Service" />
      </Head>
      <Container>
        <div
          className="bg-light rounded-3 my-3 px-5 mx-5 py-3 border border-warning"
          style={{
            height: '44rem',
            overflowY: 'scroll',
          }}
        >
          <h3>my blogs</h3>
          <hr />
          <div className="px-3 mt-2">
            {blogs.length ? (
              blogs.map((blog) => (
                <MyBlogItem
                  blog={blog}
                  key={blog.id}
                  onDeleteBlog={deleteBlog}
                />
              ))
            ) : (
              <h3 className="text-danger">Top Stories ...</h3>
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default MyBlogsPage;
