import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Blogs from '../../components/Searching/Blogs';
import Questions from '../../components/Searching/Questions';

const SearchPage = () => {
  const router = useRouter();
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [relatedQuestions, setRelatedQuestions] = useState([]);

  const fetchRelatedBlogs = async (key) => {
    try {
      const { data } = await axios.get(`/search/blogs?key=${key}`);
      setRelatedBlogs(data.blogs);
    } catch (e) {
      toast.error(e.response.data.msg);
    }
  };
  const fetchRelatedQuestions = async (key) => {
    try {
      const { data } = await axios.get(`/search/questions?key=${key}`);
      setRelatedQuestions(data.questions);
    } catch (e) {
      toast.error(e.response.data.msg);
    }
  };

  useEffect(() => {
    const key = router.query.key;
    if (key) {
      fetchRelatedBlogs(key);
      fetchRelatedQuestions(key);
    }
  }, [router.query.key]);

  return (
    <>
      <Head>
        <title>SearchResult | GlobalPal</title>
        <meta name="description" content="GlobalPal Service" />
      </Head>
      <Container className="text-light  my-3 border border-warning">
        <div
          className="mx-5 px-5 py-3 bg-light rounded-2 text-dark mt-3"
          style={{
            height: '45rem',
            overflowY: 'scroll',
          }}
        >
          <div className="border rounded p-3 mt-3">
            <h1 className="fs-4">
              blogs related to{' '}
              <b className="text-primary">
                {router.query.key ? router.query.key : ''}
              </b>
            </h1>
            <Blogs blogs={relatedBlogs} />
          </div>
          <div className="border rounded p-3 mt-3">
            <h1 className="fs-4">
              Questions related to{' '}
              <b className="text-primary">
                {router.query.key ? router.query.key : ''}
              </b>
            </h1>
            <Questions questions={relatedQuestions} />
          </div>
        </div>
      </Container>
    </>
  );
};

export default SearchPage;
