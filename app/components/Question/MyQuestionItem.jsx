import moment from 'moment';
import Link from 'next/link';
import React from 'react';
import {
  ChatLeftTextFill,
  CheckCircle,
  PencilSquare,
  Trash3,
} from 'react-bootstrap-icons';

const MyQuestionItem = ({ question, onDeleteQuestion }) => {
  return (
    <div className="p-2 my-1 bg-light border rounded">
      <div className="d-flex justify-content-between align-items-center">
        <div className="text-break">
          <Link href={`/questions/${question.id}`}>
            <h5 role="button" className="text-primary">
              {question.title}
            </h5>
          </Link>
        </div>
        <div className="d-flex align-items-center">
          <Link href={`/questions/edit/${question.id}`}>
            <PencilSquare
              style={{
                fontSize: '20px',
                cursor: 'pointer',
              }}
            />
          </Link>
          <Trash3
            style={{
              fontSize: '20px',
              marginLeft: '4px',
              cursor: 'pointer',
              color: 'red',
            }}
            onClick={() => onDeleteQuestion(question.id)}
          />
        </div>
      </div>
      <div>
        <span>
          {question.content.length > 256
            ? question.content.substring(0, 256) + '...'
            : question.content}
        </span>
      </div>
      <div className="d-flex align-items-center justify-content-between mt-2">
        <span className="badge bg-success px-2">{question.topic}</span>
        <div className="d-flex align-items-center">
          <ChatLeftTextFill />
          <span className="ms-1">{question.number_of_answers}</span>
          {question.status === 1 && (
            <CheckCircle
              style={{ color: 'green', fontSize: '25px' }}
              className="ms-1"
              title="Answered by a doctor"
            />
          )}
        </div>
        <span className="text-muted">
          {moment(question.created_at).format('DD/MM/yyyy HH:mm')}
        </span>
      </div>
    </div>
  );
};

export default MyQuestionItem;
