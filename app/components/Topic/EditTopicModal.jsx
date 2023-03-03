import { useState } from 'react';
import axios from 'axios';
import { Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const EditTopicModal = ({
  isShow,
  selectedTopic,
  onCloseModal,
  onSetSelectedTopic,
  onSetTopics,
}) => {
  const [topic, setTopic] = useState(selectedTopic.topic);

  const editTopic = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.patch(`/topics/${selectedTopic.id}/update`, {
        topic,
      });
      onSetSelectedTopic(null);
      onSetTopics((prev) => {
        const topics = JSON.parse(JSON.stringify(prev));
        const top = topics.find((t) => t.id === selectedTopic.id);
        top.topic = topic;
        return topics;
      });
      toast(data.msg);
      onCloseModal();
    } catch (err) {
      toast.error(e.response?.data.msg);
    }
  };

  return (
    <Modal show={isShow} onHide={onCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Topic</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-end px-4 py-4">
        <Form onSubmit={editTopic}>
          <Form.Control
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button className="btn btn-outline-success px-4 mt-3" type="submit">
            correct
          </button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditTopicModal;
