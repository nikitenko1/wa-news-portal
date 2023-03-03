import Link from 'next/link';
import { PatchQuestionFill } from 'react-bootstrap-icons';
import { Alert } from 'react-bootstrap';
import moment from 'moment';

const QuestionNotification = ({ notification, role }) => {
  return (
    <Link
      href={
        role === 'DOCTOR'
          ? `/doctor/questions/${notification.question_id}`
          : `/questions/${notification.question_id}`
      }
      className="text-decoration-none"
    >
      <Alert
        variant="light"
        className="px-3 py-2 my-1 rounded border"
        role="button"
      >
        <div>
          <h5 className="text-primary">
            <PatchQuestionFill style={{ color: 'blue' }} /> There are new
            questions on topics that interest you.
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

export default QuestionNotification;
