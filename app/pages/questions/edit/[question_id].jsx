import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';

const EditQuestionPage = ({ question_ }) => {
  const router = useRouter();
  const [question, setQuestion] = useState({
    id: question_.id,
    title: question_.title,
    content: question_.content,
    topic_id: question_.topic_id,
  });
  const { id, title, content, topic_id } = question;
  const [topics, setTopics] = useState([{ id: '' }]);

  const fetchTopics = async () => {
    try {
      const { data } = await axios.get(`/topics`);
      setTopics(data.topics);
    } catch (err) {
      toast.error(err.response.error.msg);
    }
  };

  useEffect(() => {
    if (router.query.question_id) {
      fetchTopics();
    }
  }, [router.query.question_id]);

  const handleSelect = (e) => {
    setQuestion({
      ...question,
      topic_id: e.target.value,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestion({
      ...question,
      [name]: value,
    });
  };

  const updateQuestion = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.patch(`/questions/${id}/update`, question);
      toast(data.msg);
    } catch (e) {
      toast.error(e.response.data.msg);
    }
  };

  return (
    <>
      <Head>
        <title>
          {question_.title.length > 30
            ? question_.title.substring(0, 30) + '...'
            : question_.title}
        </title>
        <meta name="description" content="GlobalPal Service" />
      </Head>

      <Container>
        <div className="my-3 shadow-sm mx-5 px-5 bg-light rounded-2 py-3 border border-warning">
          <h2>edit question</h2>
          <hr />
          <div className="px-3">
            <Form onSubmit={updateQuestion}>
              <Form.Group className="mb-2">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={title}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="4"
                  name="content"
                  value={content}
                  onChange={handleChange}
                />
              </Form.Group>
              <div className="w-50">
                <Form.Group className="mb-2">
                  <Form.Label>Select topic</Form.Label>
                  <Form.Select
                    defaultValue={question.topic_id}
                    onChange={handleSelect}
                  >
                    {topics.map((topic) => (
                      <option
                        value={topic.id}
                        key={topic.id}
                        selected={topic.id === topic_id}
                      >
                        {topic.topic}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="text-end">
                <Button variant="success" className="px-5 py-2" type="submit">
                  Edit
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Container>
    </>
  );
};

EditQuestionPage.getInitialProps = async ({ query }) => {
  try {
    const { question_id } = query;
    const { data } = await axios.get(`/questions/${question_id}`);
    return { question_: data.question };
  } catch (err) {
    return toast.error(err.response?.data.msg);
  }
};

export default EditQuestionPage;
