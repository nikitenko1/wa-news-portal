import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { profileActions } from '../store';

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch((state) => state.profileSlice);
  const [isLoading, setIsLoading] = useState(false);
  const [enteredData, setEnteredData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = enteredData;

  const handleChange = (e) => {
    setEnteredData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(`/auth/signin`, enteredData);

      toast.success(data.msg);
      window.localStorage.setItem('user', JSON.stringify(data.user));
      dispatch(profileActions.setInitialProfile(data.user));
      setTimeout(() => {
        switch (data.user.role) {
          case 'PATIENT':
            router.replace('/');
            break;
          case 'DOCTOR':
            router.push('/doctor/home');
            break;
          case 'ADMIN':
            router.push('/admin/dashboard');
        }
      }, 2000);
    } catch (err) {
      toast.error(err.response.data.msg);
    }
    setIsLoading(false);
  };
  return (
    <>
      <Head>
        <title>Login | GlobalPal</title>
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
          <div className="w-50" style={{ height: '30rem' }}>
            <img
              src="/auth.jpg"
              style={{ width: '100%', height: '30rem', objectFit: 'cover' }}
              alt="..."
            />
          </div>
          <div className="w-50 h-100 p-5">
            <h1>Login</h1>

            <div className="my-4 px-4">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-2">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="email..."
                    name="email"
                    onChange={handleChange}
                    value={email}
                  />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="password..."
                    name="password"
                    onChange={handleChange}
                    value={password}
                  />
                </Form.Group>
                <div className="py-4">
                  <div className="d-flex align-items-center justify-content-end">
                    <Link href="/register">
                      <span className="text-primary me-3" role="button">
                        ← Register page
                      </span>
                    </Link>
                    <Button valiant="outline-primary" type="submit">
                      {isLoading ? 'Submitting...' : 'Login'}
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

export default Login;
