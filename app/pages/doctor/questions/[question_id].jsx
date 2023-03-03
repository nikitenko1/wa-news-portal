import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import moment from 'moment';
import { useState } from 'react';
import { Badge, Container } from 'react-bootstrap';
import { EyeFill } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import UserProfileModal from '../../../components/Question/UserProfileModal';
import Answers from '../../../components/Answer/Answers';

const DoctorQuestionPage = ({ question }) => {
  const [isShow, setIsShow] = useState(false);

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
        <UserProfileModal
          isShow={isShow}
          onSetIsShow={setIsShow}
          user={{ name: question.name, birthday: question.birthday }}
        />
        <div
          className="mt-3 mx-5 px-5 py-3 bg-light rounded-3 position-relative shadow-sm border border-warning"
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
              right: 1,
              top: 1,
            }}
            className="px-3 py-2"
          >
            <Link href={`/topics/${question.topic_id}`} className="text-light">
              <span role="button">{question.topic}</span>
            </Link>
          </Badge>
          <div>
            <h5>{question.title}</h5>
            <p>{question.content}</p>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div
              className="d-flex align-items-center"
              role="button"
              onClick={() => setIsShow(true)}
              title="View profile"
            >
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
              <span className="ms-1 fw-bold">{question.name}</span>
            </div>
            <div className="d-flex align-items-center">
              <EyeFill
                style={{
                  fontSize: '20px',
                }}
              />
              <span className="ms-1">{question.views}</span>
            </div>
            <div>
              <span className="text-muted">
                {moment(question.created_at).format('DD/MM/yyyy HH:mm')}
              </span>
            </div>
          </div>
          {question && <Answers questionId={question.id} isDoctor={true} />}
        </div>
      </Container>
    </>
  );
};

export default DoctorQuestionPage;

DoctorQuestionPage.getInitialProps = async ({ query }) => {
  try {
    const { question_id } = query;
    const { data } = await axios.get(`/questions/${question_id}`);
    return { question: data.question };
  } catch (err) {
    return toast.error(err.response?.data.msg);
  }
};
