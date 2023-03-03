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

const CovidHistory = () => {
  const [histories, setHistories] = useState([]);

  const fetchHistories = async () => {
    try {
      const { data } = await axios.get('/assessments/covid');
      setHistories(data.assessments);
    } catch (e) {
      toast.error(e.response.data.msg);
    }
  };

  useEffectOnce(() => {
    fetchHistories();
  });

  const AssessmentHistoryComponent = ({ assessment }) => {
    if (assessment.result >= 0 && assessment.result <= 5) {
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
              You are at no risk of COVID-19.
            </h5>
          </div>
          <div className="d-flex align-items-center justify-content-between mt-2">
            <span>
              You are able to live a normal life, but should maintain a safe
              distance from others. Wear a mask in public, wash your hands
              often. Get vaccinated when eligible which will protect you.
            </span>
            <span className="text-muted">
              {moment(assessment.created_at).format('DD/MM/yyyy HH:mm')}
            </span>
          </div>
        </div>
      );
    } else if (assessment.result > 5 && assessment.result <= 9) {
      return (
        <div className="px-2 text-break">
          <div className="d-flex align-items-center">
            <EmojiNeutralFill
              style={{
                fontSize: '32px',
                color: 'orange',
              }}
            />
            <h5 className="text-primary ms-2">
              You are likely to be infected with COVID-19.
            </h5>
          </div>
          <div className="d-flex align-items-center justify-content-between mt-2">
            <span>
              You should isolate yourself in a room. Separate use of the private
              bathroom Wear a hygienic mask all the time. Dining alone. Contact
              as few people in the house as possible.
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
            <h5 className="text-danger ms-2">You are most likely COVID-19.</h5>
          </div>
          <div className="d-flex align-items-center justify-content-between mt-2">
            <span>
              You need to quarantine urgently. Notify the hospital In order to
              make a diagnosis to know the results. Iif infected The real
              COVID-19 will be able to pass on further treatment
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
        <div className="p-2" key={assessment.id}>
          <AssessmentHistoryComponent assessment={assessment} />
        </div>
      ))}
    </div>
  );
};

export default CovidHistory;
