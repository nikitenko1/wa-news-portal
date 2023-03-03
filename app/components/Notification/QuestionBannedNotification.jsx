import { Alert } from 'react-bootstrap';
import moment from 'moment';
import { ExclamationCircleFill } from 'react-bootstrap-icons';

const QuestionBannedNotification = ({ notification }) => {
  return (
    <Alert variant="danger" className="px-3 py-2 my-1 rounded border">
      <div>
        <h5>
          <ExclamationCircleFill style={{ color: 'red' }} /> Your question has
          been deleted. Because the question violates the rules of our website.
        </h5>
      </div>
      <div className="text-end">
        <span className="text-muted">
          {moment(notification.created_at).fromNow()}
        </span>
      </div>
    </Alert>
  );
};

export default QuestionBannedNotification;
