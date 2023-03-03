import { Modal, Button } from 'react-bootstrap';
import { EyeFill, CheckCircle } from 'react-bootstrap-icons';
import moment from 'moment';
import Link from 'next/link';

const RelatedQuestionsAlert = ({
  relatedQuestions,
  isAlert,
  onCloseModal,
  onConfirmCreateNewQuestion,
}) => {
  return (
    <Modal show={isAlert} onHide={onCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Are these the questions you want to ask?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {relatedQuestions.map((question) => (
          <div className="border my-1 rounded-2 p-2" key={question.id}>
            <Link
              href={`/questions/${question.id}`}
              target="_blank"
              rel="noreferrer"
            >
              <h6>{question.title}</h6>
            </Link>
            <div className="mt-3 d-flex align-items-center justify-content-between text-dark">
              <div className="d-flex align-items-center">
                <EyeFill />
                <span className="ms-1">{question.views}</span>
              </div>
              <div>
                <CheckCircle
                  style={{
                    color: 'green',
                    fontSize: '20px',
                  }}
                  title="Answered by doctor"
                />
              </div>
              <span className="text-muted">
                {moment(question.created_at).fromNow()}
              </span>
            </div>
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={onConfirmCreateNewQuestion}>
          keep asking
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RelatedQuestionsAlert;
