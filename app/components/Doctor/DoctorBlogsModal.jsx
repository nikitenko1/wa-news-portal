import { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import DoctorBlogItem from './DoctorBlogItem';

const DoctorBlogsModal = ({ isShow, onCloseBlogsModalHandler, doctorId }) => {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get(`/admin/doctors/${doctorId}/blogs`);
      setBlogs(data.blogs);
    } catch (err) {
      toast.error(err.response.data.msg);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [doctorId]);

  return (
    <Modal show={isShow} onHide={onCloseBlogsModalHandler}>
      <Modal.Header closeButton>
        <Modal.Title>Blogs</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="px-3">
          {blogs.length ? (
            blogs.map((blog) => <DoctorBlogItem blog={blog} key={blog.id} />)
          ) : (
            <span>does not exist in the profile</span>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DoctorBlogsModal;
