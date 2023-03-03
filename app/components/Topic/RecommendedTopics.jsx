import useEffectOnce from '@/hooks/useEffectOnce';
import axios from 'axios';
import Link from 'next/link';
import { useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { ArrowRightCircle, Hash } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';

const RecommendedTopics = () => {
  const [topics, setTopics] = useState([]);

  const fetchTopics = async () => {
    try {
      const { data } = await axios.get(`/topics/popular`);
      setTopics(data.topics);
    } catch (err) {
      toast.error(err.response?.data.msg);
    }
  };
  useEffectOnce(() => {
    fetchTopics();
  });

  return (
    <div className="py-3 px-3">
      <h3>Popular topics</h3>
      <hr />
      <div className="d-flex flex-column justify-content-between">
        <ListGroup>
          {topics.map((topic) => (
            <Link href={`/topics/${topic.id}`} key={topic.id}>
              <ListGroup.Item
                action
                className="d-flex align-items-center my-1"
                role="button"
              >
                <Hash />
                <span className="fs-5">{topic.topic}</span>
              </ListGroup.Item>
            </Link>
          ))}
        </ListGroup>
        <div className="text-end">
          <Link href="/topics" className="text-primary" role="button">
            View all topics <ArrowRightCircle />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecommendedTopics;
