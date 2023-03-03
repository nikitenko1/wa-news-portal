import React, { useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

const ClearQuestionModal = ({
  isShow,
  onCloseClearQuestionModal,
  onFetchAggregation,
}) => {
  const [number, setNumber] = useState(1);
  const [selectedOpt, setSelectedOpt] = useState('Days');

  const clearQuestions = async () => {
    try {
      const { data } = await axios.delete(
        `/admin/questions/remove?number=${number}&period=${selectedOpt}`
      );
      toast(data.msg);
      onCloseClearQuestionModal();
      onFetchAggregation();
      toast(data.msg);
    } catch (err) {
      toast.error(err.response?.data.msg);
    }
  };

  return (
    <Modal show={isShow} onHide={onCloseClearQuestionModal}>
      <Modal.Header closeButton>
        <Modal.Title>Clear unanswered questions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div>
            <div>
              <span>Clear questions from the moment</span>
            </div>
            <div className="d-flex align-items-center">
              <input
                type="number"
                className="form-control w-75"
                min={1}
                value={number}
                onChange={(e) => setNumber(+e.target.value)}
              />
              <Form.Select
                className="w-25 ms-1"
                defaultChecked={'Days'}
                checked={selectedOpt}
                onChange={(e) => setSelectedOpt(e.target.value)}
              >
                <option value="Days">Days</option>
                <option value="Weeks">Weeks</option>
              </Form.Select>
            </div>
          </div>
          <div className="text-end mt-2">
            <button className="btn btn-danger px-4" onClick={clearQuestions}>
              Clear
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ClearQuestionModal;
