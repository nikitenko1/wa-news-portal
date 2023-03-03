import useEffectOnce from '@/hooks/useEffectOnce';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import {
  Badge,
  Container,
  Dropdown,
  Nav,
  Navbar,
  SplitButton,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { profileActions } from '../../store';
import SearchBar from '../Searching/SearchBar';

const Doctor = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { name, profileImageUrl, unreadNotifications } = useSelector(
    (state) => state.profileSlice
  );

  const handleLogout = async () => {
    dispatch(profileActions.removeProfileState());

    await axios.get(`/auth/logout`).then(() => {
      window.localStorage.removeItem('user');
    });
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  };

  const fetchUnreadNotification = async () => {
    try {
      const { data } = await axios.get(`/notifications/unread`);
      dispatch(profileActions.setUnreadNotification(data.unreadNotification));
    } catch (err) {
      toast.error('Failed notification. Require login.', {
        toastId: '#3',
      });
    }
  };

  useEffectOnce(() => {
    fetchUnreadNotification();
  });

  const ProfileComponent = ({ name, profileImageUrl }) => (
    <Link href="/doctor/profile" className="text-decoration-none">
      <div className="d-flex align-items-center">
        <img
          src={profileImageUrl}
          style={{
            borderRadius: '50%',
            width: '35px',
            height: '35px',
            objectFit: 'cover',
          }}
          alt="doctor"
        />
        <span
          className="text-warning ms-2 fw-bold"
          style={{
            overflow: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </span>
      </div>
    </Link>
  );

  return (
    <Navbar bg="dark" variant="dark border-bottom border-warning">
      <Container>
        <Navbar.Brand>
          <Link href="/doctor/home">
            <div className="d-flex align-items-center" role="button">
              <h1
                style={{
                  fontFamily: 'Dancing Script',
                  fontSize: '38px',
                }}
              >
                GlobalPal Doctor
              </h1>
            </div>
          </Link>
        </Navbar.Brand>
        <div className="w-100">
          <SearchBar />
        </div>
        <Nav className="ms-auto">
          <div className="d-flex align-items-center">
            <SplitButton
              variant="dark"
              title={
                <ProfileComponent
                  name={name}
                  profileImageUrl={profileImageUrl}
                />
              }
            >
              <Dropdown.Item>
                <Link
                  href="/blogs/create"
                  className="text-dark text-decoration-none"
                >
                  <span role="button">create new blog</span>
                </Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <Link
                  href="/blogs/my-blogs"
                  className="text-dark text-decoration-none"
                >
                  <span role="button">my blog</span>
                </Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <Link
                  href="/doctor/topics"
                  className="text-dark text-decoration-none"
                >
                  <span role="button">manage topics</span>
                </Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <Link
                  href="/notifications"
                  className="text-dark text-decoration-none"
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <span role="button">alert</span>
                    {unreadNotifications > 0 ? (
                      <Badge pill bg="danger">
                        {unreadNotifications}
                      </Badge>
                    ) : (
                      <Badge pill bg="success">
                        0
                      </Badge>
                    )}
                  </div>
                </Link>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>
                <span
                  className="text-danger text-decoration-none"
                  role="button"
                >
                  logout
                </span>
              </Dropdown.Item>
            </SplitButton>
          </div>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Doctor;
