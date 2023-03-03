import Link from 'next/link';
import moment from 'moment/moment';
import { Alert } from 'react-bootstrap';
import { BodyText } from 'react-bootstrap-icons';

const BlogNotification = ({ notification }) => {
  return (
    <Link
      href={`/blogs/${notification.blog_id}`}
      className="text-decoration-none"
    >
      <Alert
        variant="light"
        className="px-3 py-2 my-1 rounded border"
        role="button"
      >
        <div>
          <h5>
            <BodyText style={{ color: 'black' }} /> There are new blogs on
            topics that interest you.
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

export default BlogNotification;
