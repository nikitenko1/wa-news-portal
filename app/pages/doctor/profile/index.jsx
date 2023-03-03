import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import useEffectOnce from '../../../hooks/useEffectOnce';
import { profileActions } from '../../../store';
import { Container, FloatingLabel, Form } from 'react-bootstrap';
import ChangePasswordModal from '../../../components/Profile/ChangePasswordModal';
import TopicsModal from '../../../components/Profile/TopicsModal';

const DoctorProfilePage = () => {
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

  const { email, name, url, personal_information, interested_in } = userData;

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
      const { data } = await axios.get('/profile/doctor');
      setOldUerData(data);
      setUserData(data);
    } catch (e) {
      toast.error(e.response.data.msg);
    }
  };

  useEffectOnce(() => {
    fetchProfile();
  });

  const updateProfile = async () => {
    try {
      const { data } = await axios.patch(`/profile/doctor`, userData);
      toast.success(data.msg);
      dispatch(profileActions.updateProfile({ name: userData.name }));
    } catch (err) {
      toast.error(err.response.data.msg);
    }
    setIsEditing(false);
  };

  const removeAttention = async (topicId) => {
    const answer = window.confirm('Do you want to delete this topic?');
    if (answer) {
      try {
        const { data } = await axios.delete(
          `/profile/attentions/remove/${topicId}`
        );
        toast.error(data.msg);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const addedNewTopics = (topics) => {
    setUserData({
      ...userData,
      interested_in: topics,
    });
  };

  return (
    <Container className="px-5 my-3 border border-warning">
      <div className="px-5 py-3">
        <div className="row bg-light rounded-3 p-4 mx-5">
          <div className="col-4 p-4">
            <div className="w-100 text-center">
              <img
                src={url}
                roundedCircle={true}
                style={{ width: '85%', objectFit: 'cover' }}
                alt="..."
              />
            </div>
            <div className="mt-4">
              <button
                className="btn btn-outline-success w-100 mb-2"
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
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Personal information</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={6}
                    placeholder="Personal information"
                    value={personal_information}
                    name="personal_information"
                    onChange={handleChange}
                    readOnly={!isEditing}
                  />
                </Form.Group>
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
                          onClick={() => removeAttention(topic.id)}
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
          onAddedNewTopics={addedNewTopics}
          isShowTopics={isShowTopics}
          onCloseTopicModal={closeTopicsModal}
          interested_in={interested_in}
        />
      )}
    </Container>
  );
};

export default DoctorProfilePage;
