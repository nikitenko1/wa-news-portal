import axios from 'axios';
import moment from 'moment/moment';
import Link from 'next/link';
import React, { useState } from 'react';
import { EyeFill } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import useEffectOnce from '../../hooks/useEffectOnce';

const LatestTopicBlogs = ({ topicId }) => {
  const [blogs, setBlogs] = useState([]);
  const [isShowMore, setIsShowMore] = useState(false);

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get(`/topics/${topicId}/blogs`);
      setBlogs(data.blogs);
    } catch (err) {
      toast.error(err.response.data.msg);
    }
  };

  useEffectOnce(() => {
    fetchBlogs();
  });

  return (
    <div className="p-3 border rounded">
      {blogs.length ? (
        <h5>latest blogs</h5>
      ) : (
        <h5 className="text-danger">Latest blog - empty array ... </h5>
      )}

      {blogs.slice(0, isShowMore ? blogs.length : 5).map((blog) => (
        <Link href={`/blogs/${blog.id}`} key={blog.id}>
          <div
            className="latest-blog-item d-flex border my-1 p-2 position-relative"
            role="button"
          >
            <span
              className="badge bg-success px-2"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            >
              {'just a cold'}
            </span>
            <div>
              <img
                src={blog.url}
                className="rounded"
                style={{
                  height: '120px',
                  width: '180px',
                  objectFit: 'cover',
                }}
                alt="..."
              />
            </div>
            <div className="ms-2 d-flex flex-column justify-content-between w-100 text-break">
              <div>
                <h5>{blog.title}</h5>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <EyeFill />
                  <span className="ms-1">{blog.views}</span>
                </div>
                <div>
                  <span className="text-muted">
                    {moment(blog.created_at).fromNow()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
      {blogs.length > 5 && !isShowMore && (
        <div className="text-center my-2">
          <button
            className="btn btn-success text-light"
            onClick={() => setIsShowMore(true)}
          >
            Show more
          </button>
        </div>
      )}
    </div>
  );
};

export default LatestTopicBlogs;
