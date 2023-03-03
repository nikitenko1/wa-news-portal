import { useState } from 'react';
import { Modal, Form, FloatingLabel } from 'react-bootstrap';

const EditAnswerModal = ({
  isShow,
  onCloseModal,
  onUserEditAnswer,
  oldContent,
}) => {
  const [content, setContent] = useState(oldContent);

  return (
    <Modal show={isShow} onHide={onCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>edit answer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="px-3">
          <Form onSubmit={(e) => onUserEditAnswer(e, content)}>
            <FloatingLabel controlId="floatingTextarea" label="your answer">
              <Form.Control
                as="textarea"
                placeholder="Leave a comment here"
                style={{ height: '120px' }}
                onChange={(e) => setContent(e.target.value)}
                value={content}
              />
            </FloatingLabel>
            <div className="mt-3">
              <button className="btn btn-outline-primary">correct</button>
            </div>
          </Form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditAnswerModal;
