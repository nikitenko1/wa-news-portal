import useEffectOnce from '@/hooks/useEffectOnce';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import QuestionItem from './QuestionItem';

const LatestQuestions = ({ isDoctor }) => {
  const [questions, setQuestions] = useState([]);

  const fetchLatestQuestions = async () => {
    try {
      const { data } = await axios.get(`/questions/latest`);
      setQuestions(data.questions);
    } catch (err) {
      toast.error(err.response?.data.msg);
    }
  };
  useEffectOnce(() => {
    fetchLatestQuestions();
  });

  return (
    <div className="py-3 px-4">
      <h3>Latest questions</h3>
      <hr />
      <div>
        {questions.map((question) => (
          <QuestionItem
            question={question}
            isDoctor={isDoctor}
            key={question.id}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestQuestions;
