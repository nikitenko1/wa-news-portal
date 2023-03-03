import axios from 'axios';
import Link from 'next/link';
import React, { useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import { CardList } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import useEffectOnce from '../../hooks/useEffectOnce';

const TopicsPage = () => {
  const [keyword, setKeyword] = useState('');
  const [topics, setTopics] = useState([]);

  const handleSearch = (e) => {
    setKeyword(e.target.value);
  };

  const fetchTopics = async () => {
    try {
      const { data } = await axios.get('/topics');
      setTopics(data.topics);
    } catch (e) {
      toast.error(e.response.error.msg);
    }
  };

  useEffectOnce(() => {
    fetchTopics();
  });

  return (
    <Container>
      <div
        className="bg-light rounded-3 mx-5 px-5 py-3 my-3 border border-warning"
        style={{
          height: '38rem',
          overflowY: 'scroll',
        }}
      >
        <h2>All topics</h2>
        <hr />
        <div className="px-5">
          <Form.Control
            type="text"
            className="mx-auto w-75 mb-3"
            placeholder="Search..."
            onChange={handleSearch}
            value={keyword}
            style={{
              borderRadius: '2rem',
            }}
          />
          <div className="w-100 py-2">
            {topics.map((topic) => (
              <Link href={`/topics/${topic.id}`} key={topic.id}>
                <div
                  className="rounded p-3 border mb-1 w-75 mx-auto d-flex align-items-center"
                  style={{
                    backgroundColor: 'white',
                  }}
                >
                  <CardList
                    style={{
                      fontSize: '24px',
                      marginRight: '3px',
                    }}
                  />
                  <span role="button" className="ms-1">
                    {topic.topic}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default TopicsPage;
