import axios from 'axios';
import Head from 'next/head';
import React, { useState } from 'react';
import { Container, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import useEffectOnce from '../../hooks/useEffectOnce';
import { resizeImage } from '../../utils/imageResizer';
import RichTextEditor from '../../components/Blog/RichTextEditor';

const CreateBlogPage = () => {
  const profileSlice = useSelector((state) => state.profileSlice);
  const [data, setData] = useState({
    title: '',
    image: null,
    selectedTopicId: '',
  });
  const [content, setContent] = useState('');
  const { title, selectedTopicId } = data;
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const fetchTopics = async () => {
    try {
      const res = await axios.get(`/topics`);
      setTopics(res.data.topics);
      setData({
        ...data,
        selectedTopicId: res.data.topics[0] ? res.data.topics[0].id : null,
      });
    } catch (e) {
      toast.error(e.response?.data.msg);
    }
  };

  useEffectOnce(() => {
    fetchTopics();
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;
    if (name === 'image') {
      const file = e.target.files[0];
      const base64Image = await resizeImage(file);
      setImagePreview(URL.createObjectURL(file));
      setData({
        ...data,
        image: base64Image,
      });
    } else {
      setData({
        ...data,
        [name]: value,
      });
    }
  };

  const createNewBlog = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(`/blogs/create`, { ...data, content });
      setData({
        title: '',
        image: topics[0].id,
        selectedTopicId: '',
      });
      setContent('');
      setImagePreview(null);
      toast(res.data.msg);
    } catch (e) {
      toast.error(e.response.data.msg);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title>Create Blog | {profileSlice.role} | GlobalPal</title>
        <meta name="description" content="GlobalPal Service" />
      </Head>
      <Container>
        <div
          className="px-5 my-3 bg-light rounded-2 mx-5 py-5 border border-warning"
          style={{
            height: '45rem',
            overflowY: 'scroll',
          }}
        >
          <h1>Create a new blog</h1>
          <hr />

          <div className="mb-2">
            <span>Title</span>
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              name="title"
              value={title}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            {imagePreview !== '' && (
              <img
                src={imagePreview}
                alt="cover image"
                className="w-100 rounded-2 mb-1"
                style={{ height: '260px', objectFit: 'cover' }}
              />
            )}
            <span>picture</span>
            <input
              type="file"
              className="form-control w-50"
              accept="image/*"
              name="image"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <span>content</span>
            <RichTextEditor content={content} setContent={setContent} />
          </div>
          <div className="mb-3 w-50">
            <Form.Group className="mb-2">
              <Form.Label>Select topic</Form.Label>
              <Form.Select
                value={selectedTopicId}
                onChange={(e) =>
                  setData({
                    ...data,
                    selectedTopicId: e.target.value,
                  })
                }
              >
                <>
                  <option>select</option>
                  {topics.map((topic) => (
                    <option value={topic.id} key={topic.id}>
                      {topic.topic}
                    </option>
                  ))}{' '}
                </>
              </Form.Select>
            </Form.Group>
          </div>
          <div className="text-end">
            <button
              className="btn btn-outline-primary px-5"
              onClick={createNewBlog}
              disabled={isLoading}
            >
              {isLoading ? 'Creating..' : 'Create'}
            </button>
          </div>
        </div>
      </Container>
    </>
  );
};

export default CreateBlogPage;
