import axios from 'axios';

import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const ChangePasswordModal = ({
  isChangePassword,
  onCloseChangePasswordModal,
}) => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const changePassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (password.trim().length < 6) {
      toast.error('Password must be at least 6 characters');
    } else if (password !== confirm) {
      toast.error('The password and confirm password fields do not match.');
    } else
      try {
        const { data } = await axios.patch(`/profile/password/change`, {
          password,
        });
        onCloseChangePasswordModal();
        toast(data.msg);
      } catch (err) {
        toast.error(err.response.data.msg);
      }
    setIsLoading(false);
  };

  return (
    <Modal show={isChangePassword} onHide={onCloseChangePasswordModal}>
      <Modal.Header closeButton>
        <Modal.Title>change password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={changePassword}>
          <Form.Group className="mb-3">
            <Form.Label>new password</Form.Label>
            <Form.Control
              type="password"
              placeholder="New password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>confirm password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              onChange={(e) => setConfirm(e.target.value)}
              value={confirm}
            />
          </Form.Group>
          <div className="text-end">
            <Button
              variant="secondary"
              className="me-2"
              onClick={onCloseChangePasswordModal}
            >
              cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? 'changing..' : 'change password'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ChangePasswordModal;
