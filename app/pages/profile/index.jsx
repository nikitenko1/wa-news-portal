import axios from 'axios';
import React, { useState } from 'react';
import { Container, FloatingLabel, Form, Image } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import useEffectOnce from '../../hooks/useEffectOnce';
import { profileActions } from '../../store';
import ChangePasswordModal from '../../components/Profile/ChangePasswordModal';
import TopicsModal from '../../components/Profile/TopicsModal';

const Profile = () => {
  const dispatch = useDispatch();
  const [oldUserData, setOldUerData] = useState({
    interested_in: [],
  });
  const [userData, setUserData] = useState({
    interested_in: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [isShowTopics, setIsShowTopics] = useState(false);

  const { email, name, url, birthday, interested_in } = userData;

  const addNewTopics = (topics) => {
    setUserData({
      ...userData,
      interested_in: topics,
    });
  };

  const openChangePasswordModal = () => {
    setIsChangePassword(true);
  };
  const closeChangePasswordModal = () => {
    setIsChangePassword(false);
  };
  const openTopicsModal = () => {
    setIsShowTopics(true);
  };
  const closeTopicsModal = () => {
    setIsShowTopics(false);
  };

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(`/profile`);
      const bd = new Date(data.birthday);
      setUserData({
        ...data,
        birthday: `${bd.getFullYear()}-${
          bd.getMonth() === 0
            ? '01'
            : bd.getMonth() < 10
            ? '0' + bd.getMonth()
            : bd.getMonth()
        }-${
          bd.getDate() === 0
            ? '01'
            : bd.getDate() < 10
            ? '0' + bd.getDate()
            : bd.getDate()
        }`,
      });
      setOldUerData({
        ...data,
        birthday: `${bd.getFullYear()}-${
          bd.getMonth() === 0
            ? '01'
            : bd.getMonth() < 10
            ? '0' + bd.getMonth()
            : bd.getMonth()
        }-${
          bd.getDate() === 0
            ? '01'
            : bd.getDate() < 10
            ? '0' + bd.getDate()
            : bd.getDate()
        }`,
      });
    } catch (e) {
      toast.error(e.response.data.msg);
    }
  };
  useEffectOnce(() => {
    fetchProfile();
  });

  const handleRemoveAttention = async (topicId) => {
    const answer = window.confirm('Do you want to delete this topic?');
    if (answer) {
      try {
        const { data } = await axios.delete(
          `/profile/attentions/remove/${topicId}`
        );
        toast.success(data.msg);
        const filtered = interested_in.filter((topic) => topic.id !== topicId);
        setUserData({
          ...userData,
          interested_in: filtered,
        });
      } catch (e) {
        toast.error(e.response.data.msg);
      }
    }
  };

  const updateProfile = async () => {
    try {
      const { data } = await axios.patch(`/profile`, userData);
      toast(data.msg);
      setOldUerData(userData);
      dispatch(profileActions.updateProfile({ name: userData.name }));
    } catch (e) {
      toast.error(e.response.data.msg);
    }
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container className="px-5">
      <div className="px-5 py-3">
        <div className="row bg-light rounded-3 p-4 mx-5 mt-3">
          <div className="col-4 p-4">
            <div className="w-100 text-center">
              <Image
                src={url}
                roundedCircle={true}
                style={{ width: '85%' }}
                alt="..."
              />
            </div>
            <div className="mt-4">
              <button
                className="btn btn-outline-primary w-100 mb-2"
                onClick={() => setIsEditing(true)}
                disabled={isEditing}
              >
                edit profile
              </button>
              <button
                className="btn btn-outline-danger w-100 mb-2"
                onClick={openChangePasswordModal}
              >
                change password
              </button>
            </div>
          </div>
          <div className="col-8 mt-3">
            <h1>Profile</h1>
            <hr />
            <div className="d-flex flex-column justify-content-between">
              <div>
                <FloatingLabel label="Email address" className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={email}
                    disabled
                  />
                </FloatingLabel>
                <FloatingLabel label="Username" className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    value={name}
                    name="name"
                    onChange={handleChange}
                    readOnly={!isEditing}
                  />
                </FloatingLabel>
                <FloatingLabel label="Birthday" className="mb-3">
                  <Form.Control
                    type="date"
                    placeholder="Birthday"
                    value={birthday}
                    name="birthday"
                    onChange={handleChange}
                    readOnly={!isEditing}
                  />
                </FloatingLabel>
                <Form.Group className="mb-3">
                  <Form.Label>Your attentions</Form.Label>
                  <div>
                    {interested_in.map((topic) => (
                      <button
                        className="btn btn-outline-success me-2"
                        style={{ position: 'relative' }}
                        key={topic.id}
                      >
                        {topic.topic}
                        <span
                          className="badge bg-danger"
                          style={{
                            position: 'absolute',
                            right: -10,
                            top: -10,
                            borderRadius: '50%',
                          }}
                          onClick={() => handleRemoveAttention(topic.id)}
                        >
                          X
                        </span>
                      </button>
                    ))}
                    <button
                      className="btn btn-outline-success"
                      onClick={openTopicsModal}
                    >
                      +
                    </button>
                  </div>
                </Form.Group>
              </div>
              {isEditing && (
                <div className="text-end">
                  <button
                    className="btn btn-danger me-2"
                    onClick={() => {
                      setIsEditing(false);
                      setUserData(oldUserData);
                    }}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" onClick={updateProfile}>
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {isChangePassword && (
        <ChangePasswordModal
          isChangePassword={isChangePassword}
          onCloseChangePasswordModal={closeChangePasswordModal}
        />
      )}
      {isShowTopics && (
        <TopicsModal
          onAddedNewTopics={addNewTopics}
          isShowTopics={isShowTopics}
          onCloseTopicModal={closeTopicsModal}
          interested_in={interested_in}
        />
      )}
    </Container>
  );
};

export default Profile;
