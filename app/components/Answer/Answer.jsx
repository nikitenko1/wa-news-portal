import Link from 'next/link';
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  CheckCircleFill,
  PencilSquare,
  ReplyAllFill,
  Trash3,
} from 'react-bootstrap-icons';
import moment from 'moment/moment';
import ReplyAnswerModal from './ReplyAnswerModal';
import EditAnswerModal from './EditAnswerModal';

const Answer = ({
  answer,
  id,
  onSetAnswers,
  userId,
  role,
  questionOwner,
  repliedAnswer,
}) => {
  const [isShow, setIsShow] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const deleteAnswer = async () => {
    const ans = window.confirm('Do you want to delete this answer?');
    if (ans) {
      try {
        const { data } = await axios.delete(
          `/questions/${answer.question_id}/answers/${answer.id}`
        );
        toast(data.msg);
        onSetAnswers((prev) => prev.filter((a) => a.id !== answer.id));
      } catch (e) {
        toast.error(e.response.data.msg);
      }
    }
  };

  const editAnswer = async (e, newAnswer) => {
    e.preventDefault();
    try {
      await axios.patch(
        `/questions/${answer.question_id}/answers/${answer.id}/update`,
        {
          content: newAnswer,
        }
      );
      toast('Updated');
      onSetAnswers((prev) => {
        const answers = JSON.parse(JSON.stringify(prev));
        console.log(answers);
        const answerTemp = answers.find((ans) => ans.id === answer.id);
        answerTemp.content = newAnswer;
        return answers;
      });
      setIsShow(false);
    } catch (e) {
      toast.error(e.response.data.msg);
    }
  };

  return (
    <div className="my-1 rounded border py-2 px-2 position-relative bg-white">
      <ReplyAnswerModal
        handleClose={handleClose}
        repliedAnswer={repliedAnswer}
        selectedAnswerId={answer.id}
        show={show}
      />
      <EditAnswerModal
        isShow={isShow}
        onCloseModalHandler={setIsShow}
        onUserEditAnswer={editAnswer}
        oldContent={answer.content}
      />
      <div className="d-flex justify-content-between">
        {answer.role === 'DOCTOR' ? (
          <Link href={`/doctor/profile/${answer.user_id}`}>
            <div className="d-flex align-items-center" role="button">
              <img
                src={answer.url}
                style={{
                  width: '35px',
                  height: '35px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                }}
                alt="..."
              />
              <span className="ms-1">{answer.name}</span>
              {answer.role === 'DOCTOR' && (
                <CheckCircleFill className="ms-1" style={{ color: 'green' }} />
              )}
            </div>
          </Link>
        ) : (
          <div className="d-flex align-items-center">
            <img
              src={answer.url}
              style={{
                width: '35px',
                height: '35px',
                objectFit: 'cover',
                borderRadius: '50%',
              }}
              alt="..."
            />
            <span className="mx-1">{answer.name}</span>
            {answer.role === 'DOCTOR' && (
              <CheckCircleFill className="ms-1" style={{ color: 'green' }} />
            )}
          </div>
        )}
        {answer.user_id === id && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {answer.user_id == id && (
              <PencilSquare
                style={{
                  fontSize: '25px',
                  cursor: 'pointer',
                  marginRight: '2px',
                }}
                onClick={() => setIsShow(true)}
              />
            )}
            <Trash3
              style={{
                color: 'red',
                fontSize: '25px',
                cursor: 'pointer',
              }}
              onClick={deleteAnswer}
            />
          </div>
        )}
      </div>
      <div className="px-3 mt-2">
        <span>{answer.content}</span>
      </div>
      <div className="d-flex align-items-center justify-content-between">
        <div className="ms-3 mt-2">
          <span className="text-muted">
            {moment(answer.created_at).fromNow()}
          </span>
        </div>
        {(questionOwner === userId || role === 'DOCTOR') &&
          answer.user_id !== userId && (
            <ReplyAllFill
              style={{
                color: 'gray',
                fontSize: '25px',
                cursor: 'pointer',
              }}
              onClick={handleShow}
            />
          )}
      </div>
    </div>
  );
};

export default Answer;
