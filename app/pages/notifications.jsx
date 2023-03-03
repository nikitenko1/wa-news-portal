import axios from 'axios';
import Head from 'next/head';
import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import useEffectOnce from '../hooks/useEffectOnce';
import { profileActions } from '../store';
import BlogNotification from '../components/Notification/BlogNotification';
import QuestionNotification from '../components/Notification/QuestionNotification';
import AnswerNotification from '../components/Notification/AnswerNotification';
import ReplyNotification from '../components/Notification/ReplyNotification';
import QuestionBannedNotification from '../components/Notification/QuestionBannedNotification';

const NotificationsPage = () => {
  const dispatch = useDispatch();

  const { role } = useSelector((state) => state.profileSlice);

  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(`/notifications`);
      setNotifications(data.notifications);
      await axios.patch(`/notifications/read`, {});
      dispatch(profileActions.readNotification());
    } catch (err) {
      toast.error(err.response.data.msg);
    }
  };

  useEffectOnce(() => {
    console.log(notifications);
    fetchNotifications();
  });

  return (
    <>
      <Head>
        <title>Notifications | GlobalPal</title>
        <meta name="description" content="GlobalPal Service" />
      </Head>
      <Container className="px-5 mt-3 pb-3">
        <div
          className="mx-5 bg-light rounded-3 p-3"
          style={{
            height: '45rem',
            overflowY: 'scroll',
          }}
        >
          <h3>Notifications</h3>
          <hr />
          <div className="px-4 py-2">
            {notifications?.map((notification) => {
              if (notification.type === 'BLOG') {
                return (
                  <BlogNotification
                    notification={notification}
                    key={notification.id}
                  />
                );
              } else if (notification.type === 'QUESTION') {
                return (
                  <QuestionNotification
                    notification={notification}
                    role={role}
                    key={notification.id}
                  />
                );
              } else if (notification.type === 'ANSWER') {
                return (
                  <AnswerNotification
                    notification={notification}
                    key={notification.id}
                  />
                );
              } else if (notification.type === 'REPLY') {
                return (
                  <ReplyNotification
                    notification={notification}
                    role={role}
                    key={notification.id}
                  />
                );
              } else if (notification.type === 'QUESTION_BANNED') {
                return (
                  <QuestionBannedNotification
                    notification={notification}
                    key={notification.id}
                  />
                );
              }
            })}
          </div>
        </div>
      </Container>
    </>
  );
};

export default NotificationsPage;
