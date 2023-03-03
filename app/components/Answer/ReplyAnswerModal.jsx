import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const ReplyAnswerModal = ({
  handleClose,
  show,
  selectedAnswerId,
  repliedAnswer,
}) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleReply = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `/questions/${router.query.question_id}/answers/${selectedAnswerId}/reply`,
        { content }
      );
      toast('replied');
      repliedAnswer(data.answer);
      handleClose();
    } catch (err) {
      toast.error(err.response.data.msg);
    }
    setIsLoading(false);
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>respond</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleReply}>
          <div className="mb-2">
            <Form.Control
              as="textarea"
              style={{
                height: '6rem',
              }}
              placeholder="respond..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <Button variant="primary" type="submit">
            {isLoading ? 'replying...' : 'respond'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ReplyAnswerModal;
