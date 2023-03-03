import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FloatingLabel, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import Answer from './Answer';

const Answers = ({ questionId, isDoctor, questionOwner }) => {
  const router = useRouter();
  const { userId, role } = useSelector((state) => state.profileSlice);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');

  const fetchAnswers = async () => {
    try {
      const { data } = await axios.get(`/questions/${questionId}/answers`);
      setAnswers(data.answers);
    } catch (e) {
      toast.error(e.response.data.msg);
    }
  };

  useEffect(() => {
    if (questionId) {
      fetchAnswers();
    }
  }, [questionId]);

  const answerQuestion = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `/questions/${router.query.question_id}/answers`,
        { content }
      );
      toast.success(data.msg);
      setAnswers([...answers, data.answer]);
      setContent('');
    } catch (e) {
      toast.error(e.response.data.msg);
    }
    setIsLoading(false);
  };

  const repliedAnswer = (newReply) => {
    setAnswers([...answers, newReply]);
  };

  return (
    <div className="mt-2 bg-light rounded-3 p-3">
      <h4>{answers.length} answers</h4>
      <hr />
      <div>
        {isDoctor && (
          <div className="my-3 w-100 mx-auto">
            <FloatingLabel
              controlId="floatingTextarea"
              label="type your answer ... "
            >
              <Form.Control
                as="textarea"
                placeholder="Leave a comment here"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{ height: '100px' }}
              />
            </FloatingLabel>
            <div className="text-end">
              <button
                className="btn btn-outline-primary mt-2"
                onClick={answerQuestion}
                disabled={isLoading}
              >
                {isLoading ? 'answering..' : 'answer questions'}
              </button>
            </div>
          </div>
        )}
        {answers.map((answer) => (
          <Answer
            id={userId}
            key={answer.id}
            answer={answer}
            repliedAnswer={repliedAnswer}
            isDoctor={isDoctor}
            questionOwner={questionOwner}
            onSetAnswers={setAnswers}
            userId={userId}
            role={role}
          />
        ))}
      </div>
    </div>
  );
};

export default Answers;
