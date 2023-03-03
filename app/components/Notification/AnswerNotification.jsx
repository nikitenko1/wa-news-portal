import moment from 'moment';
import Link from 'next/link';
import React from 'react';
import { Alert } from 'react-bootstrap';
import { CheckCircleFill } from 'react-bootstrap-icons';

const AnswerNotification = ({ notification }) => {
  return (
    <Link
      href={`/questions/${notification.question_id}`}
      className="text-decoration-none"
    >
      <Alert
        variant="light"
        className="px-3 py-2 my-1 rounded border"
        role="button"
      >
        <div>
          <h5>
            <CheckCircleFill style={{ color: 'green' }} /> The doctor has
            answered your question.{' '}
          </h5>
        </div>
        <div className="text-end">
          <span className="text-muted">
            {moment(notification.created_at).fromNow()}
          </span>
        </div>
      </Alert>
    </Link>
  );
};

export default AnswerNotification;
