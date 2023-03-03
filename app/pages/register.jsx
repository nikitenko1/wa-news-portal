import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

const Register = () => {
  const [enteredData, setEnteredData] = useState({
    email: '',
    name: '',
    password: '',
    birthday: '',
  });
  const { email, name, password, birthday } = enteredData;
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await axios.post(`/auth/signup`, enteredData);
      toast(data.msg);
      setEnteredData({
        email: '',
        name: '',
        password: '',
        birthday: '',
      });
    } catch (e) {
      toast.error(e.response.data.msg);
    }
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEnteredData({
      ...enteredData,
      [name]: value,
    });
  };
  return (
    <>
      <Head>
        <title>Register | GlobalPal</title>
        <meta name="description" content="GlobalPal Service" />
      </Head>
      <div className="d-flex justify-content-center align-items-center">
        <div
          className="d-flex align-items-center bg-light mt-4 overflow-hidden"
          style={{
            width: '60rem',
            height: '30rem',
            borderRadius: '8px',
          }}
        >
          <div className="w-50 bg-primary" style={{ height: '30rem' }}>
            <img
              src="/auth.jpg"
              style={{ width: '100%', height: '30rem', objectFit: 'cover' }}
              alt="..."
            />
          </div>
          <div className="w-50 h-100 p-4">
            <h1>Register</h1>
            <div className="my-4 px-4">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-1">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="email..."
                    name="email"
                    value={email}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-1">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="name..."
                    name="name"
                    value={name}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-1">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="password..."
                    name="password"
                    value={password}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-1">
                  <Form.Label>Day/month/year of birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="birthday"
                    value={birthday}
                    onChange={handleChange}
                  />
                </Form.Group>
                <div className="py-4">
                  <div className="d-flex align-items-center justify-content-end">
                    <Link href="/login">
                      <span className="text-primary me-3" role="button">
                        ← Login page
                      </span>
                    </Link>
                    <Button
                      valiant="outline-primary"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Registering..' : 'Register'}
                    </Button>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
