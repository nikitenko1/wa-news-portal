import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Hash } from 'react-bootstrap-icons';
import LatestTopicQuestions from '../../components/Topic/LatestTopicQuestions';
import LatestTopicBlogs from '../../components/Topic/LatestTopicBlogs';
import Head from 'next/head';

const TopicPage = ({ topic }) => {
  const router = useRouter();
  const [topicId, setTopicId] = useState(null);

  useEffect(() => {
    if (router.query.topicId) {
      setTopicId(router.query.topicId);
    }
  }, [router.query.topicId]);

  return (
    <>
      <Head>
        <title>
          {topic.topic.length > 30
            ? topic.topic.substring(0, 30) + '...'
            : topic.topic}
        </title>
        <meta name="description" content="GlobalPal Service" />
      </Head>
      <Container>
        <div
          className="bg-light rounded-3 mx-5 px-5 py-3 my-3 border border-warning"
          style={{
            height: '45rem',
            overflowY: 'scroll',
          }}
        >
          <h3 className="d-flex align-items-center">
            <Hash />
            {topic.topic}
          </h3>
          <hr />
          {topicId && (
            <div>
              <LatestTopicBlogs topicId={topicId} />
              <br />
              <LatestTopicQuestions topicId={topicId} />
            </div>
          )}
        </div>
      </Container>
    </>
  );
};

export default TopicPage;

TopicPage.getInitialProps = async ({ query }) => {
  try {
    const { topicId } = query;
    const { data } = await axios.get(`/topics/${topicId}`);
    return { topic: data.topic };
  } catch (err) {
    return toast.error(err.response?.data.msg);
  }
};
