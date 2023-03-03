import axios from 'axios';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import useEffectOnce from '../../../hooks/useEffectOnce';
import QuestionItem from '../../../components/Question/QuestionItem';

const DoctorInterestingQuestion = () => {
  const [questions, setQuestions] = useState([]);
  const profileSlice = useSelector((state) => state.profileSlice);

  const router = useRouter();
  useEffect(() => {
    if (profileSlice.role !== 'DOCTOR') router.push('/login');
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data } = await axios.get(
        `/questions/doctor/questions/interested`
      );
      setQuestions(data.questions);
    } catch (err) {
      toast.error(err.response?.data.msg);
    }
  };

  useEffectOnce(() => {
    fetchQuestions();
  });

  const banQuestion = async (id) => {
    const answer = window.confirm('Would you like to ban this question?');
    if (answer) {
      try {
        await axios.delete(`/questions/${id}/ban`);
        const filtered = questions.filter((question) => question.id !== id);
        setQuestions(filtered);
        toast('Banned');
      } catch (err) {
        toast.error(err.response?.data.msg);
      }
    }
  };

  return (
    <Container>
      <div
        className="mt-2 px-4 bg-light pt-3 pb-4"
        style={{
          height: '45rem',
          overflowY: 'scroll',
        }}
      >
        <div>
          <h1>Recent questions that have not been answered by a doctor</h1>
          <hr />
          <div className="px-3">
            {questions.length ? (
              questions.map((question) => (
                <QuestionItem
                  question={question}
                  onBanQuestion={banQuestion}
                  isDoctor={true}
                  key={question.id}
                />
              ))
            ) : (
              <h3 className="text-danger">No Recent questions</h3>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default DoctorInterestingQuestion;
