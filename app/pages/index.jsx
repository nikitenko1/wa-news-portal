import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import RecommendedBlogs from '../components/Blog/RecommendedBlogs';
import LatestQuestions from '../components/Question/LatestQuestions';
import RecommendedTopics from '../components/Topic/RecommendedTopics';

const Home = () => {
  const profileSlice = useSelector((state) => state.profileSlice);
  const [isDoctor, setIsDoctor] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (profileSlice.role !== 'PATIENT') {
      router.push('/login');
    }
    if (profileSlice.role === 'DOCTOR') {
      setIsDoctor(true);
    }
  }, [profileSlice]);

  return (
    <>
      <Head>
        <title>Home {profileSlice.role} | GlobalPal</title>
        <meta name="description" content="GlobalPal Service" />
      </Head>
      <Container className="mt-3 pb-4">
        <div className="d-flex justify-content-around">
          <div className="bg-light rounded w-75">
            <RecommendedBlogs isDoctor={isDoctor} />
            <LatestQuestions isDoctor={isDoctor} />
          </div>
          <div className="bg-light rounded w-25 ms-3 vh-100">
            <RecommendedTopics isDoctor={isDoctor} />
          </div>
        </div>
      </Container>
    </>
  );
};

export default Home;
