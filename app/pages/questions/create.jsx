import axios from 'axios';
import React, { useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import useEffectOnce from '../../hooks/useEffectOnce';
import RelatedQuestionsAlert from '../../components/Question/RelatedQuestionsAlert';
import Head from 'next/head';

const CreateQuestionPage = () => {
  const [enteredData, setEnteredData] = useState({
    title: '',
    content: '',
    topicId: '',
  });
  const [topics, setTopics] = useState([]);
  const [isAlert, setIsAlert] = useState(false);
  const [relatedQuestions, setRelatedQuestions] = useState([]);

  const { title, content, topicId } = enteredData;

  const handleChange = (e) => {
    setEnteredData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const fetchTopics = async () => {
    try {
      const { data } = await axios.get(`/topics`);
      setTopics(data.topics);
      setEnteredData({
        ...enteredData,
        topicId: data.topics[0].id,
      });
    } catch (err) {
      toast.error(err.response?.data.msg);
    }
  };

  useEffectOnce(() => {
    fetchTopics();
  });

  const confirmCreateNewQuestion = async () => {
    try {
      const { data } = await axios.post(`/questions/create`, enteredData);
      toast.success(data.msg);
      setIsAlert(false);
      setEnteredData({
        title: '',
        content: '',
        topicId: topics[0].id || null,
      });
    } catch (err) {
      toast.error(err.response.data.msg);
    }
  };

  const createNewQuestion = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(`/questions/related/${topicId}`);

      if (data.questions) {
        if (data.questions.length > 0) {
          setRelatedQuestions(data.questions);
          setIsAlert(true);
        } else {
          confirmCreateNewQuestion();
        }
      } else {
        confirmCreateNewQuestion();
      }
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message);
    }
  };

  const closeModal = () => {
    setIsAlert(false);
  };

  return (
    <>
      <Head>
        <title>Question Create | GlobalPal</title>
        <meta name="description" content="GlobalPal Service" />
      </Head>
      <Container>
        <RelatedQuestionsAlert
          isAlert={isAlert}
          onCloseModal={closeModal}
          onConfirmCreateNewQuestion={confirmCreateNewQuestion}
          relatedQuestions={relatedQuestions}
        />
        <div className="vh-100 mx-5 px-5 py-3 bg-light rounded-3 mt-3">
          <h1>Create new question</h1>
          <hr className="bg-dark" />
          <Form onSubmit={createNewQuestion}>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                onChange={handleChange}
                value={title}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows="4"
                name="content"
                onChange={handleChange}
                value={content}
              />
            </Form.Group>

            <div className="w-50">
              <Form.Group className="mb-2">
                <Form.Label>Select topic</Form.Label>
                <Form.Select
                  value={topicId}
                  onChange={(e) =>
                    setEnteredData({
                      ...enteredData,
                      topicId: e.target.value,
                    })
                  }
                >
                  <option>Select ... </option>
                  {topics.map((topic) => (
                    <option
                      value={topic.id}
                      key={topic.id}
                      onClick={() =>
                        setEnteredData({
                          ...enteredData,
                          topicId: topic.id,
                        })
                      }
                    >
                      {topic.topic}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
            <div className="text-end">
              <Button variant="primary" className="px-5 py-2" type="submit">
                Create
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </>
  );
};

export default CreateQuestionPage;
