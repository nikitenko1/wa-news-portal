import axios from 'axios';
import Head from 'next/head';
import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { toast } from 'react-toastify';
import useEffectOnce from '../../hooks/useEffectOnce';
import MyQuestionItem from '../../components/Question/MyQuestionItem';

const MyQuestionsPage = () => {
  const [questions, setQuestions] = useState([]);

  const fetchMyQuestions = async () => {
    try {
      const { data } = await axios.get(`/questions/my-questions`);
      setQuestions(data.questions);
    } catch (err) {
      toast.error(err.response.data.msg);
    }
  };

  useEffectOnce(() => {
    fetchMyQuestions();
  });

  const deleteQuestion = async (id) => {
    alert('Would you like to delete this question??');

    try {
      const { data } = await axios.delete(`/questions/${id}`);
      const filtered = questions.filter((q) => q.id !== id);
      setQuestions(filtered);
      toast(data.msg);
    } catch (err) {
      toast.error(err.response.data.msg);
    }
  };

  return (
    <>
      <Head>
        <title>My Questions | GlobalPal</title>
        <meta name="description" content="GlobalPal Service" />
      </Head>
      <Container>
        <div
          className="mx-5 px-5 bg-light rounded-3 pt-3 my-3 border border-warning"
          style={{
            height: '45rem',
            overflowY: 'scroll',
          }}
        >
          <div>
            <h3>My questions: {questions.length}</h3>
            <hr />
            <div className="px-4 mt-2 pb-5">
              {questions.length ? (
                questions.map((question) => (
                  <MyQuestionItem
                    question={question}
                    key={question.id}
                    onDeleteQuestion={deleteQuestion}
                  />
                ))
              ) : (
                <h3 className="text-danger">No my questions</h3>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default MyQuestionsPage;
