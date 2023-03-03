import axios from 'axios';
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import useEffectOnce from '../../hooks/useEffectOnce';

const TopicsModal = ({
  isShowTopics,
  onCloseTopicModal,
  interested_in,
  onAddedNewTopics,
}) => {
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);

  const fetchTopics = async () => {
    try {
      const { data } = await axios.get(`/topics`);
      const mapping = interested_in.map((topic) => topic.id);
      const filtered = data.topics.filter(
        (topic) => !mapping.includes(topic.id)
      );
      setTopics(filtered);
    } catch (e) {
      toast.error(e.response.data.msg);
    }
  };

  useEffectOnce(() => {
    fetchTopics();
  });

  const handleSelectTopics = (topicId) => {
    if (selectedTopics.includes(topicId)) {
      const filtered = selectedTopics.filter(
        (selectedTopicId) => selectedTopicId !== topicId
      );
      setSelectedTopics(filtered);
    } else {
      setSelectedTopics((prev) => [...prev, topicId]);
    }
  };

  const addNewTopic = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.patch(`/profile/attentions/add`, {
        topics: selectedTopics,
      });
      onAddedNewTopics(data.interested_in);
      toast.success(data.msg);
      onCloseTopicModal();
    } catch (err) {
      toast.error(err.response?.data.msg);
    }
  };

  return (
    <>
      <Modal show={isShowTopics} onHide={onCloseTopicModal}>
        <Modal.Header closeButton>
          <Modal.Title>Choose a topic of interest</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            height: '25rem',
            overflowY: 'scroll',
          }}
        >
          <div className="py-3 d-flex flex-wrap">
            {topics.map((topic) => (
              <div className="m-1" key={topic.id}>
                <input
                  type="checkbox"
                  className="btn-check"
                  id={`success-outlined_${topic.id}`}
                  onChange={() => handleSelectTopics(topic.id)}
                  checked={selectedTopics.includes(topic.id)}
                />
                <label
                  className="btn btn-outline-success px-3"
                  htmlFor={`success-outlined_${topic.id}`}
                >
                  {topic.topic}
                </label>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={addNewTopic}>
            add to interest
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TopicsModal;
