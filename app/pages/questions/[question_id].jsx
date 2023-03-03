import axios from 'axios';
import moment from 'moment';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Badge, Container } from 'react-bootstrap';
import { EyeFill } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import Answers from '../../components/Answer/Answers';

const QuestionPage = ({ question }) => {
  const router = useRouter();

  let isFetched = false;

  const fetchQuestion = async () => {
    await axios.patch(`/questions/${question.id}/views/increase`, {});

    isFetched = true;
  };

  useEffect(() => {
    if (router.query.question_id && !isFetched) {
      fetchQuestion(router.query.question_id);
    }
  }, [router.query.question_id]);

  return (
    <>
      <Head>
        <title>
          {question.title.length > 30
            ? question.title.substring(0, 30) + '...'
            : question.title}
        </title>
        <meta name="description" content="GlobalPal Service" />
      </Head>
      <Container>
        <div
          className="mt-3 mx-5 px-5 py-3 bg-light border border-warning rounded-3 position-relative"
          style={{
            height: '45rem',
            overflowY: 'scroll',
          }}
        >
          <Badge
            pill
            bg="success"
            style={{
              position: 'absolute',
              right: 7,
              top: 7,
            }}
            className="px-3 py-2"
          >
            <Link
              href={`/topics/${question.topic_id}`}
              className="text-light text-decoration-none"
            >
              <span role="button">{question.topic}</span>
            </Link>
          </Badge>
          <div>
            <h5>{question.title}</h5>
            <p>{question.content}</p>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex flex-column align-items-center me-2">
              <img
                src={question.url}
                style={{
                  width: '40px',
                  height: '40px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                }}
                alt="..."
              />
              <span className="ms-1">{question.name}</span>
            </div>
            <div className="d-flex flex-column align-items-center me-2">
              <EyeFill
                style={{
                  fontSize: '20px',
                }}
              />
              <span className="ms-1">{question.views}</span>
            </div>
            <div>
              <span className="text-muted">
                {moment(question.created_at).format('DD/MM HH:mm')}
              </span>
            </div>
            <Answers
              questionId={question.id}
              questionOwner={question.user_id}
            />
            <hr />
          </div>
        </div>
      </Container>
    </>
  );
};

QuestionPage.getInitialProps = async ({ query }) => {
  try {
    const { question_id } = query;
    const { data } = await axios.get(`/questions/${question_id}`);
    return { question: data.question };
  } catch (err) {
    return toast.error(err.response?.data.msg);
  }
};

export default QuestionPage;
