import axios from 'axios';
import moment from 'moment/moment';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Badge, Container } from 'react-bootstrap';
import { ArrowRightCircle, EyeFill } from 'react-bootstrap-icons';
import RelatedBlog from '../../components/Blog/RelatedBlog';
import { toast } from 'react-toastify';

const BlogPage = () => {
  const router = useRouter();
  const [blog, setblog] = useState({});
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  let isFetched = false;

  const fetchRelatedBlogs = async (topic_id) => {
    try {
      const { data } = await axios.get(
        `/blogs/topics/${topic_id}/related-blogs`
      );
      setRelatedBlogs(data.blogs);
      await axios.patch(`/blogs/${router.query.blog_id}/increase/views`);
      toast(data.msg);
    } catch (e) {
      toast.error(e.response.data.msg);
    }
  };

  const fetchblog = async (blogId) => {
    try {
      const { data } = await axios.get(`/blogs/${blogId}`);
      setblog(data.blog);

      fetchRelatedBlogs(data.blog.topic_id);
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  useEffect(() => {
    if (router.query.blog_id && !isFetched) {
      fetchblog(router.query.blog_id);
    }
  }, [router.query.blog_id]);

  return (
    <>
      <Head>
        <title>{blog.title}</title>
        <meta name="description" content="GlobalPal Service" />
      </Head>
      <Container>
        <div className="d-flex my-3 mx-5 border border-warning">
          <div className="w-75 px-5 mb-4 py-3 bg-light rounded-3 position-relative">
            <Badge
              pill
              bg="success"
              style={{
                position: 'absolute',
                left: 0,
                top: -10,
              }}
              className="px-3 py-2"
            >
              <Link href={`/topics/${blog.topic_id}`} className="text-white">
                <span role="button">{blog.topic}</span>
              </Link>
            </Badge>
            <h4>{blog.title}</h4>
            <hr />
            <div>
              <div className="w-100 text-center">
                <img
                  src={blog.blog_url}
                  style={{
                    width: '500px',
                    height: '300px',
                    objectFit: 'cover',
                  }}
                  className="mx-auto"
                  alt="..."
                />
              </div>
              <div
                className="mt-3"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
            <hr />
            <div className="mt-3 d-flex justify-content-between align-items-center">
              <Link href={`/doctor/profile/${blog.doctor_id}`}>
                <div className="d-flex align-items-center" role="button">
                  <img
                    src={blog.profile_url}
                    style={{
                      width: '35px',
                      height: '35px',
                      objectFit: 'cover',
                      borderRadius: '50%',
                    }}
                    alt="..."
                  />
                  <span className="ms-1">{blog.name}</span>
                </div>
              </Link>
              <div className="d-flex align-items-center">
                <EyeFill style={{ fontSize: '25px', cursor: 'pointer' }} />
                <span className="ms-1">{blog.views}</span>
              </div>
              <div>
                <span className="text-muted">
                  {moment(blog.created_at).format('DD/MM/yyy HH:mm')}
                </span>
              </div>
            </div>
          </div>
          <div className="w-25 ms-3 mb-4 rounded bg-light py-3 px-2 h-100">
            <h5>related blog</h5>
            <hr />

            <div>
              {relatedBlogs.map((blog) => (
                <RelatedBlog blog={blog} key={blog.id} />
              ))}
              <div>
                <Link href={`/topics/${blog.topic_id}`} legacyBehavior>
                  <a className="d-flex align-items-center justify-content-end">
                    <span>See more blogs on this topic.</span>
                    <ArrowRightCircle className="ms-1" />
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default BlogPage;
