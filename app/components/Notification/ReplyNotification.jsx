import Link from 'next/link';
import { ChatDotsFill } from 'react-bootstrap-icons';
import { Alert } from 'react-bootstrap';
import moment from 'moment';

const ReplyNotification = ({ notification }) => {
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
          <h5 className="text-primary">
            <ChatDotsFill style={{ color: 'skyblue' }} /> Someone replied to
            your answer.
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

export default ReplyNotification;
