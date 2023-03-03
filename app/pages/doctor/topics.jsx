import axios from 'axios';
import Head from 'next/head';
import React, { useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import { PencilSquare, Trash3 } from 'react-bootstrap-icons';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import EditTopicModal from '../../components/Topic/EditTopicModal';
import useEffectOnce from '../../hooks/useEffectOnce';

const TopicPage = () => {
  const profileSlice = useSelector((state) => state.profileSlice);

  const [newTopic, setNewTopic] = useState('');
  const [topics, setTopics] = useState(null);
  const [isShow, setIsShow] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const fetchTopics = async () => {
    try {
      const { data } = await axios.get(`/topics`);
      setTopics(data.topics);
    } catch (e) {
      toast.error(e.response.data.msg);
    }
  };

  useEffectOnce(() => {
    fetchTopics();
  });

  const createTopic = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(`/topics/create`, {
        topic: newTopic,
      });
      setTopics([...topics, data.topic]);
      toast(data.msg);
      setNewTopic('');
    } catch (e) {
      toast.error(e.response.data.msg);
    }
  };

  const deleteTopic = async (id) => {
    const answer = window.confirm('Would you like to delete this topic?');
    if (answer) {
      try {
        const { data } = await axios.delete(`/topics/${id}`);
        const filtered = topics.filter((topic) => topic.id !== id);
        setTopics(filtered);
        toast(data.msg);
      } catch (err) {
        toast.error(err.response.data.msg);
      }
    }
  };

  const showModal = (topic_id) => {
    const topic = topics.find((topic) => topic.id === topic_id);
    setSelectedTopic(topic);
    setIsShow(true);
  };

  const closeModal = () => {
    setIsShow(false);
  };
  return (
    <>
      <Head>
        <title>Topics | {profileSlice.role} | GlobalPal</title>
        <meta name="description" content="GlobalPal Service" />
      </Head>
      <Container>
        {selectedTopic && (
          <EditTopicModal
            isShow={isShow}
            onSetSelectedTopic={setSelectedTopic}
            selectedTopic={selectedTopic}
            onSetTopics={setTopics}
            onCloseModal={closeModal}
          />
        )}
        <div
          className="my-3 px-5 mx-5 py-3 rounded-3 bg-light d-flex border border-warning"
          style={{
            height: '39rem',
          }}
        >
          <div
            className="w-75 p-3 border rounded-2 mt-4"
            style={{
              height: '34rem',
              overflowY: 'scroll',
            }}
          >
            {topics ? (
              topics.map((topic) => (
                <div
                  key={topic.id}
                  className="px-3 py-2 border-bottom d-flex align-items-center justify-content-between"
                >
                  <span>{topic.topic}</span>
                  <div className="d-flex align-items-center">
                    <PencilSquare
                      style={{
                        cursor: 'pointer',
                        fontSize: '20px',
                        marginRight: '10px',
                      }}
                      onClick={() => showModal(topic.id)}
                    />
                    <Trash3
                      style={{
                        cursor: 'pointer',
                        fontSize: '20px',
                        color: 'red',
                      }}
                      onClick={() => deleteTopic(topic.id)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <h3 className="text-danger">No topics</h3>
            )}
          </div>
          <div
            className="w-25 ms-2 border rounded-2 mt-4 p-3"
            style={{
              height: '11rem',
            }}
          >
            <h5>Add a new topic</h5>
            <hr />
            <Form onSubmit={createTopic}>
              <input
                type="text"
                className="form-control"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
              />
              <div className="text-end">
                <button className="btn btn-primary mt-2 px-4">increase</button>
              </div>
            </Form>
          </div>
        </div>
      </Container>
    </>
  );
};

export default TopicPage;
