import axios from 'axios';
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { ArrowLeftCircle } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';

const MentalHealthAssessmentForm = () => {
  const [selectedChoices, setSelectedChoices] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [isShowResult, setIsShowResult] = useState(false);
  const [result, setResult] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const choice of selectedChoices) {
      if (choice !== 0 && !choice) {
        return toast.error('Please select all answers');
      }
    }
    try {
      const { data } = await axios.post('/assessments/mental/create', {
        choose: selectedChoices,
      });
      setIsShowResult(true);
      setResult(data.result);
    } catch (err) {
      toast.error(err.response.data.msg);
    }
  };

  const handleChangeChoice = (e) => {
    const { name, value } = e.target;
    const index = +name;
    const choice = +value;
    const copied = JSON.parse(JSON.stringify(selectedChoices));
    copied[index - 1] = choice;
    setSelectedChoices(copied);
  };

  const GetMentalResult = () => {
    if (result >= 0 && result <= 7) {
      return (
        <div className="text-center px-4 text-break">
          <h2 className="text-success">
            You don't have any or very little depression.
          </h2>
          <span className="fs-5">No treatment needed</span>
        </div>
      );
    } else if (result > 7 && result <= 13) {
      return (
        <div className="text-center px-4 text-break">
          <h2 className="text-warning">You have moderate depression.</h2>
          <span className="fs-5">
            {' '}
            Should have enough rest. Get 6-8 hours of sleep and exercise
            regularly. Do activities that are relaxing. Meet friends. Should
            seek advice from trusted people. Don't get caught up in the problem.
            Such a heavy ball can only unravel a professional. If your symptoms
            affect your work or social interactions. Depression causes you to
            have trouble at work. Taking care of things in the house or getting
            along with people at the highest level or if you have symptoms at
            this level for 1-2 weeks and have not improved. You should see a
            doctor for help and treatment.
          </span>
        </div>
      );
    } else {
      return (
        <div className="text-center px-4 text-break">
          <h2 className="text-danger">You have severe depression.</h2>
          <span className="fs-5">
            Must see a doctor to assess the symptoms and provide treatment as
            soon as possible. Nevertheless , negative reviews should not be left
            unattended.
          </span>
        </div>
      );
    }
  };

  return isShowResult ? (
    <div className="mx-5 mt-5 text-center">
      <div className="px-5 text-break mb-3">{<GetMentalResult />}</div>
      <div>
        <button className="btn btn-outline-primary">
          <ArrowLeftCircle />
          <span className="ms-1" onClick={() => setIsShowResult(false)}>
            Do the assessment again
          </span>
        </button>
      </div>
    </div>
  ) : (
    <Form
      style={{
        fontSize: '20px',
      }}
    >
      <Form.Group className="mb-4">
        <Form.Label>1. Do you feel bored and do nothing to enjoy?</Form.Label>
        <div
          className="d-flex align-items-center"
          style={{
            fontSize: '17px',
          }}
        >
          <Form.Check
            type="radio"
            label="no"
            name="1"
            role="button"
            onChange={handleChangeChoice}
            value={0}
          />
          <Form.Check
            type="radio"
            className="ms-3"
            label="unsure"
            name="1"
            role="button"
            onChange={handleChangeChoice}
            value={1}
          />
          <Form.Check
            type="radio"
            className="ms-3"
            label="yes"
            name="1"
            role="button"
            onChange={handleChangeChoice}
            value={2}
          />
        </div>
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label>
          2. Are you feeling down, depressed, or discouraged?
        </Form.Label>
        <div
          className="d-flex align-items-center"
          style={{
            fontSize: '17px',
          }}
        >
          <Form.Check
            type="radio"
            label="no"
            name="2"
            role="button"
            onChange={handleChangeChoice}
            value={0}
          />
          <Form.Check
            type="radio"
            className="ms-3"
            label="unsure"
            name="2"
            role="button"
            onChange={handleChangeChoice}
            value={1}
          />
          <Form.Check
            type="radio"
            className="ms-3"
            label="yes"
            name="2"
            role="button"
            onChange={handleChangeChoice}
            value={2}
          />
        </div>
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label>
          3. Do you find it difficult to fall asleep or stay awake or sleep too
          much?
        </Form.Label>
        <div
          className="d-flex align-items-center"
          style={{
            fontSize: '17px',
          }}
        >
          <Form.Check
            type="radio"
            label="no"
            name="3"
            role="button"
            onChange={handleChangeChoice}
            value={0}
          />
          <Form.Check
            type="radio"
            className="ms-3"
            label="unsure"
            name="3"
            role="button"
            onChange={handleChangeChoice}
            value={1}
          />
          <Form.Check
            type="radio"
            className="ms-3"
            label="yes"
            name="3"
            role="button"
            onChange={handleChangeChoice}
            value={2}
          />
        </div>
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label>4. You feel tired easily Or not very powerful?</Form.Label>
        <div
          className="d-flex align-items-center"
          style={{
            fontSize: '17px',
          }}
        >
          <Form.Check
            type="radio"
            label="no"
            name="4"
            role="button"
            onChange={handleChangeChoice}
            value={0}
          />
          <Form.Check
            type="radio"
            className="ms-3"
            label="unsure"
            name="4"
            role="button"
            onChange={handleChangeChoice}
            value={1}
          />
          <Form.Check
            type="radio"
            className="ms-3"
            label="yes"
            name="4"
            role="button"
            onChange={handleChangeChoice}
            value={2}
          />
        </div>
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label>5. You feel anorexia Or eat too much?</Form.Label>
        <div
          className="d-flex align-items-center"
          style={{
            fontSize: '17px',
          }}
        >
          <Form.Check
            type="radio"
            label="no"
            name="5"
            role="button"
            onChange={handleChangeChoice}
            value={0}
          />
          <Form.Check
            type="radio"
            className="ms-3"
            label="unsure"
            name="5"
            role="button"
            onChange={handleChangeChoice}
            value={1}
          />
          <Form.Check
            type="radio"
            className="ms-3"
            label="yes"
            name="5"
            role="button"
            onChange={handleChangeChoice}
            value={2}
          />
        </div>
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label>
          6. You feel bad about yourself. consider yourself to be a failure Or
          be a person who makes it yourself Or is the family disappointed?
        </Form.Label>
        <div
          className="d-flex align-items-center"
          style={{
            fontSize: '17px',
          }}
        >
          <Form.Check
            type="radio"
            label="no"
            name="6"
            role="button"
            onChange={handleChangeChoice}
            value={0}
          />
          <Form.Check
            type="radio"
            className="ms-3"
            label="unsure"
            name="6"
            role="button"
            onChange={handleChangeChoice}
            value={1}
          />
          <Form.Check
            type="radio"
            className="ms-3"
            label="yes"
            name="6"
            role="button"
            onChange={handleChangeChoice}
            value={2}
          />
        </div>
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label>
          7. You feel poorly concentrated when you do things like watching
          television or listening to the radio. Or work that requires
          determination?
        </Form.Label>
        <div
          className="d-flex align-items-center"
          style={{
            fontSize: '17px',
          }}
        >
          <Form.Check
            type="radio"
            label="no"
            name="7"
            role="button"
            onChange={handleChangeChoice}
            value={0}
          />
          <Form.Check
            type="radio"
            className="ms-3"
            label="unsure"
            name="7"
            role="button"
            onChange={handleChangeChoice}
            value={1}
          />
          <Form.Check
            type="radio"
            className="ms-3"
            label="yes"
            name="7"
            role="button"
            onChange={handleChangeChoice}
            value={2}
          />
        </div>
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label>
          8. Do you feel slow in talking or doing something other people can
          see? Or is it so restless that you are as restless as you used to be?
        </Form.Label>
        <div
          className="d-flex align-items-center"
          style={{
            fontSize: '17px',
          }}
        >
          <Form.Check
            type="radio"
            label="no"
            name="8"
            role="button"
            onChange={handleChangeChoice}
            value={0}
          />
          <Form.Check
            type="radio"
            className="ms-3"
            label="unsure"
            name="8"
            role="button"
            onChange={handleChangeChoice}
            value={1}
          />
          <Form.Check
            type="radio"
            className="ms-3"
            label="yes"
            name="8"
            role="button"
            onChange={handleChangeChoice}
            value={2}
          />
        </div>
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label>
          9. You feel thoughts of self-harm Or do you think it would be good if
          you died?
        </Form.Label>
        <div
          className="d-flex align-items-center"
          style={{
            fontSize: '17px',
          }}
        >
          <Form.Check
            type="radio"
            label="no"
            name="9"
            role="button"
            onChange={handleChangeChoice}
            value={0}
          />
          <Form.Check
            type="radio"
            className="ms-3"
            label="unsure"
            name="9"
            role="button"
            onChange={handleChangeChoice}
            value={1}
          />
          <Form.Check
            type="radio"
            className="ms-3"
            label="yes"
            name="9"
            role="button"
            onChange={handleChangeChoice}
            value={2}
          />
        </div>
      </Form.Group>
      <div>
        <button
          className="btn btn-primary px-4"
          type="button"
          onClick={handleSubmit}
        >
          estimate
        </button>
      </div>
    </Form>
  );
};

export default MentalHealthAssessmentForm;
