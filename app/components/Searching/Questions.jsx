import Link from 'next/link';
import { ChatLeftTextFill, CheckCircle } from 'react-bootstrap-icons';
import moment from 'moment';

const Questions = ({ questions }) => {
  console.log(questions);
  return (
    <div>
      {questions.length ? (
        questions.map((question) => (
          <Link
            href={`/questions/${question.id}`}
            key={question.id}
            className="text-decoration-none"
          >
            <div
              className="latest-question-item border border-warning rounded p-2 my-1 position-relative"
              role="button"
            >
              <span
                className="badge bg-success px-2"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                }}
              >
                {question.topic}
              </span>
              <div>
                <h6>{question.title}</h6>
              </div>
              <div>
                <span>
                  {question.content.length > 128
                    ? question.content.substring(0, 128) + '...'
                    : question.content}
                </span>
              </div>

              <div className="text-end text-secondary">
                <span className="me-5">answers: {question.answers}</span>
              </div>
              <div>
                <ChatLeftTextFill />
                <span className="ms-1">{question.answers}</span>
                <CheckCircle
                  style={{
                    color: 'green',
                    fontSize: '20px',
                    marginLeft: '2px',
                  }}
                  title="Doctors have already answered this question."
                />
              </div>
              <div>
                <span className="text-muted">
                  {moment(question.created_at).fromNow()}
                </span>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <h3 className="text-danger">No related questions</h3>
      )}
    </div>
  );
};

export default Questions;
