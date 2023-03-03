import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import useEffectOnce from '../../hooks/useEffectOnce';
import moment from 'moment';
import {
  EmojiSmileFill,
  EmojiNeutralFill,
  EmojiFrownFill,
} from 'react-bootstrap-icons';

const MentalHistory = () => {
  const [histories, setHistories] = useState([]);

  const fetchHistories = async () => {
    try {
      const { data } = await axios.get('/assessments/mental', {});
      setHistories(data.assessments);
    } catch (e) {
      toast.error(e.response.data.msg);
    }
  };

  useEffectOnce(() => {
    fetchHistories();
  });

  const AssessmentHistoryComponent = ({ assessment }) => {
    if (assessment.result >= 0 && assessment.result <= 7) {
      return (
        <div className="px-2 text-break">
          <div className="d-flex align-items-center">
            <EmojiSmileFill
              style={{
                fontSize: '32px',
                color: 'green',
              }}
            />
            <h5 className="text-success ms-2">
              You don't have any or very little depression.
            </h5>
          </div>
          <div className="d-flex align-items-center justify-content-between mt-2">
            <span>no treatment needed</span>
            <span className="text-muted">
              {moment(assessment.created_at).format('DD/MM/yyyy HH:mm')}
            </span>
          </div>
        </div>
      );
    } else if (assessment.result > 7 && assessment.result <= 13) {
      return (
        <div className="px-2 text-break">
          <div className="d-flex align-items-center">
            <EmojiNeutralFill
              style={{
                fontSize: '32px',
                color: 'orange',
              }}
            />
            <h5 className="text-primary ms-2">You have moderate depression.</h5>
          </div>
          <div className="d-flex align-items-center justify-content-between mt-2">
            <span>
              Should get enough rest. Get 6-8 hours of sleep and exercise
              regularly. Do activities that are relaxing. Hang out with riends.
            </span>
            <span className="text-muted">
              {moment(assessment.created_at).format('DD/MM/yyyy HH:mm')}
            </span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="px-2 text-break">
          <div className="d-flex align-items-center">
            <EmojiFrownFill
              style={{
                color: 'red',
                fontSize: '32px',
              }}
            />
            <h5 className="text-danger ms-2">You have severe depression.</h5>
          </div>
          <div className="d-flex align-items-center justify-content-between mt-2">
            <span>
              Must see a doctor to assess the symptoms and provide treatment as
              soon as possible. Nevertheless , negative reviews should not be
              left unattended.
            </span>
            <span className="text-muted">
              {moment(assessment.created_at).format('DD/MM/yyyy HH:mm')}
            </span>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="p-3">
      {histories.map((assessment) => (
        <div className="p-2 border rounded-2 p-2 mb-2" key={assessment.id}>
          <AssessmentHistoryComponent assessment={assessment} />
        </div>
      ))}
    </div>
  );
};

export default MentalHistory;
