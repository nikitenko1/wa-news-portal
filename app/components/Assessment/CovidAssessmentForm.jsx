import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Form } from 'react-bootstrap';
import { ArrowLeftCircle } from 'react-bootstrap-icons';

const CovidAssessmentForm = () => {
  const [selectedChoices, setSelectedChoices] = useState([
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
      const { data } = await axios.post(`/assessments/covid/create`, {
        choose: selectedChoices,
      });
      setIsShowResult(true);
      setResult(data.result);
    } catch (e) {
      toast.error(e.response.data.msg);
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

  const GetCovidResult = () => {
    if (result >= 0 && result <= 5) {
      return (
        <div className="text-center px-4 text-break">
          <h2 className="text-success">You are at no risk of COVID-19.</h2>
          <span className="fs-5">
            You are able to live a normal life, but should maintain a safe
            distance from others. Wear a mask in public, wash your hands often,
            get vaccinated when you're entitled, which will protect you.
          </span>
        </div>
      );
    } else if (result > 5 && result <= 9) {
      return (
        <div className="text-center px-4 text-break">
          <h2 className="text-warning">
            You are likely to be infected with COVID-19.
          </h2>
          <span className="fs-5">
            You should isolate yourself in a room. Separate use of the private
            bathroom. Wear a hygienic mask all the time. Dining alone. Contact
            as few people in the house as possible. Provide good ventilation,
            distance from people in the house
          </span>
        </div>
      );
    } else {
      return (
        <div className="text-center px-4 text-break">
          <h2 className="text-danger">
            You have a very high chance of contracting COVID-19.
          </h2>
          <span className="fs-5">
            You need to quarantine urgently and notify the hospital. In order to
            make a diagnosis to know the results. If infected Actually, COVID-19
            will be able to pass on further treatment.
          </span>
        </div>
      );
    }
  };

  return isShowResult ? (
    <div className="mx-5 mt-5 text-center">
      <div className="px-5 text-break mb-3">{<GetCovidResult />}</div>
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
        <Form.Label>1. Do you have a fever over 38 degrees Celsius?</Form.Label>
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
          2. You have fever, cough, runny nose, sore throat, dry throat,
          tiredness, aches, and diarrhea.red eyes, rash, night sweats? Have one
          of these symptoms?
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
          3. You find it difficult to talk? Due to shortness of breath?
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
        <Form.Label>
          4. You have a history of traveling in countries where the coronavirus
          outbreak is present. In the last 14 days?
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
        <Form.Label>
          5. Do you lose your sense of smell / your tongue doesn't taste?
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
          6. You didn't wear a mask while in a risky place?
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
          7. You feel short/fast breathing, chest pain loss of ability to speak
          / move?
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
      <div className="text-end">
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

export default CovidAssessmentForm;
