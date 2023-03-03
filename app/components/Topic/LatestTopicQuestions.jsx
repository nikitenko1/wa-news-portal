import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import useEffectOnce from '../../hooks/useEffectOnce';
import QuestionItem from '../Question/QuestionItem';

const LatestTopicQuestions = ({ topicId }) => {
  const { role } = useSelector((state) => state.profileSlice);
  const [questions, setQuestions] = useState([]);
  const [isShowMore, setIsShowMore] = useState(false);

  const fetchQuestions = async () => {
    try {
      const { data } = await axios.get(`/topics/${topicId}/questions`);
      setQuestions(data.questions);
    } catch (e) {
      toast.error(e.response.data.msg);
    }
  };

  useEffectOnce(() => {
    fetchQuestions();
  });

  return (
    <div className="p-3 border rounded">
      {questions.length ? (
        <h5>latest question</h5>
      ) : (
        <h5 className="text-danger">latest question - empty array ... </h5>
      )}
      {questions.slice(0, isShowMore ? questions.length : 5).map((question) => (
        <QuestionItem
          key={question.id}
          isDoctor={role === 'doctor'}
          question={question}
        />
      ))}
      {!isShowMore && questions.length > 4 && (
        <div className="my-2 text-center">
          <button
            className="btn btn-warning text-light"
            onClick={() => setIsShowMore(true)}
          >
            Show more
          </button>
        </div>
      )}
    </div>
  );
};

export default LatestTopicQuestions;
