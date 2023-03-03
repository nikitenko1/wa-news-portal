import useEffectOnce from '@/hooks/useEffectOnce';
import { profileActions } from '@/store';
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
import SearchBar from '../Searching/SearchBar';

const Authorized = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const { name, profileImageUrl, unreadNotifications, role } = useSelector(
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
        toastId: '#2',
      });
    }
  };
  useEffectOnce(() => {
    fetchUnreadNotification();
  });

  const ProfileComponent = ({ name, profileImageUrl }) => (
    <Link href="/profile" className="text-decoration-none">
      <div className="d-flex align-items-center">
        <img
          src={profileImageUrl}
          style={{
            borderRadius: '50%',
            width: '35px',
            height: '35px',
            objectFit: 'cover',
          }}
          alt="patient"
        />
        <span className="ms-2 text-warning">{name}</span>
      </div>
    </Link>
  );

  return (
    <Navbar bg="dark" variant="dark border-bottom border-warning">
      <Container>
        <Navbar.Brand className="d-flex">
          <Link href="/">
            <div className="d-flex align-items-center" role="button">
              <h1
                style={{
                  fontFamily: 'Dancing Script',
                  fontSize: '38px',
                }}
              >
                GlobalPal {role}
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
              style={{ width: '14rem' }}
              title={
                <ProfileComponent
                  name={name}
                  profileImageUrl={profileImageUrl}
                />
              }
            >
              <Dropdown.Item>
                <Link
                  href="/questions/create"
                  className="text-dark text-decoration-none"
                >
                  <span role="button">create new question</span>
                </Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <Link
                  href="/questions/my-questions"
                  className="text-dark text-decoration-none"
                >
                  <span role="button">my question</span>
                </Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <Link
                  href="/assessment/history"
                  className="text-primary text-decoration-none"
                >
                  <span role="button">assessment history</span>
                </Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <Link href="/notifications" className="text-decoration-none">
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="text-dark " role="button">
                      alert
                    </span>
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
                <span className="text-dark text-decoration-none" role="button">
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

export default Authorized;
