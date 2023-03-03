import { useState } from 'react';
import { Modal, Form, FloatingLabel } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { resizeImage } from '../../utils/imageResizer';
import axios from 'axios';

const AddDoctorModal = ({ openModal, closeModal, onSetDoctors }) => {
  const [data, setData] = useState({
    email: '',
    name: '',
    password: '',
    image: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const { email, name, password } = data;
  const [imagePreview, setImagePreview] = useState('');

  const handleChange = async (e) => {
    const { name, value } = e.target;
    if (name === 'image') {
      const file = e.target.files[0];
      const base64Image = await resizeImage(file);
      setImagePreview(URL.createObjectURL(file));
      setData({
        ...data,
        image: base64Image,
      });
    } else {
      setData({
        ...data,
        [name]: value,
      });
    }
  };

  const createNewDoctorHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`/admin/doctors/create`, data);
      onSetDoctors((prev) => [...prev, res.data.user]);
      setData({
        email: '',
        name: '',
        password: '',
        image: '',
      });
      closeModal();
    } catch (e) {
      toast.error(e.response.data.msg);
    }
    setIsLoading(false);
  };

  return (
    <Modal show={openModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>add a doctor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="px-3">
          <Form onSubmit={createNewDoctorHandler}>
            <FloatingLabel label="Email address" className="mb-2">
              <Form.Control
                type="email"
                placeholder="name@example.com"
                name="email"
                value={email}
                onChange={handleChange}
              />
            </FloatingLabel>
            <div className="mb-3">
              {imagePreview !== '' && (
                <img
                  src={imagePreview}
                  alt="cover image"
                  className="w-100 rounded-2 mb-1"
                  style={{ height: '260px', objectFit: 'cover' }}
                />
              )}
              <span>Profile image</span>
              <Form.Control
                type="file"
                accept="image/*"
                name="image"
                placeholder="Profile image"
                onChange={handleChange}
              />
            </div>
            <FloatingLabel label="Name" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Name"
                name="name"
                value={name}
                onChange={handleChange}
              />
            </FloatingLabel>
            <FloatingLabel label="Password" className="mb-3">
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={handleChange}
              />
            </FloatingLabel>
            <div className="text-end">
              <button
                className="btn btn-primary px-4"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Adding..' : 'Add'}
              </button>
            </div>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AddDoctorModal;
