import Link from 'next/link';
import { useState } from 'react';
import { EyeFill } from 'react-bootstrap-icons';
import useEffectOnce from '../../hooks/useEffectOnce';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';

const RecommendedBlogs = () => {
  const [blogs, setBlogs] = useState([]);

  const fetchRecommendedBlogs = async () => {
    try {
      const { data } = await axios.get(`/blogs/recommended/latest`);
      setBlogs(data.blogs);
    } catch (err) {
      toast.error(err.response?.data.msg);
    }
  };

  useEffectOnce(() => {
    fetchRecommendedBlogs();
  });
  return (
    <div className="py-3 px-4">
      <h3>Recommended blogs</h3>
      <hr />
      <div className="row">
        {blogs.length ? (
          blogs.map((blog) => (
            <Link href={`/blogs/${blog.id}`} key={blog.id}>
              <div
                className="shadow-sm col-4 bg-light rounded-3 px-0 overflow-hidden border position-relative"
                role="button"
              >
                <span
                  className="badge bg-info px-2"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                  }}
                >
                  {blog.topic}
                </span>
                <div>
                  <img
                    src={blog.url}
                    style={{
                      width: '100%',
                      height: '180px',
                      objectFit: 'cover',
                    }}
                    alt="..."
                  />
                </div>
                <div className="text-break p-2">
                  <div className="mb-2">
                    <h5>{blog.title}</h5>
                  </div>
                  <div className="border-top mt-1 pt-1 d-flex justify-content-between align-items-center">
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
          ))
        ) : (
          <h3 className="text-danger">No recommended blogs</h3>
        )}
      </div>
    </div>
  );
};

export default RecommendedBlogs;
