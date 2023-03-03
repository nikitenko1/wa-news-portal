import UnauthorizedNav from './Unauthorized';
import AuthorizedNav from './Authorized';
import AdminNav from './Admin';
import DoctorNav from './Doctor';
import AssessmentButton from '../Assessment/AssessmentButton';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const ASSESSMENT_URLS = ['/assessment/mental-health', '/assessment/covid'];

const Nav = () => {
  const router = useRouter();
  const { role } = useSelector((state) => state.profileSlice);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get(`/auth/check-user`);
      } catch (e) {
        if (
          router.pathname !== '/login' &&
          router.pathname !== '/register' &&
          !router.pathname.includes('/verify')
        ) {
          if (e.response?.status === 401 || e.response?.status === 400) {
            toast.error('Failed check user. Please login.', {
              toastId: '#1',
            });

            setTimeout(() => {
              router.push('/login');
            }, 3000);
          } else {
            router.push('/');
          }
        }
      }
    };

    fetchData();
  }, []);

  if (role === 'ADMIN') {
    return <AdminNav />;
  }

  if (role === 'DOCTOR') {
    return <DoctorNav />;
  }

  if (role === 'PATIENT') {
    return (
      <>
        <AuthorizedNav />
        {!ASSESSMENT_URLS.includes(router.pathname) && <AssessmentButton />}
      </>
    );
  }

  return <UnauthorizedNav />;
};

export default Nav;
