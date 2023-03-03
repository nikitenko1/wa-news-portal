import Head from 'next/head';
import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import CovidHistory from '../../components/Assessment/CovidHistory';
import MentalHistory from '../../components/Assessment/MentalHistory';

const AssessmentHistoryPage = () => {
  const profileSlice = useSelector((state) => state.profileSlice);
  const [selected, setSelected] = useState('MENTAL');
  return (
    <>
      <Head>
        <title>Assessment History | {profileSlice.role} </title>
        <meta name="description" content="GlobalPal Service" />
      </Head>
      <Container>
        <div
          className="mt-3 px-3 py-3 mx-5 rounded-3 bg-light shadow-sm border border-warning"
          style={{
            height: '45rem',
            overflowY: 'scroll',
          }}
        >
          <div>
            <h2>Assessment history</h2>
            <div className="d-flex">
              <div className="m-1">
                <input
                  type="radio"
                  onClick={() => setSelected('MENTAL')}
                  className="btn-check"
                  id={`success-outlined_1`}
                  name="assessment"
                  checked={selected === 'MENTAL'}
                />
                <label
                  className="btn btn-outline-success px-3"
                  htmlFor={`success-outlined_1`}
                >
                  mental health
                </label>
              </div>
              <div className="m-1">
                <input
                  type="radio"
                  onClick={() => setSelected('COVID')}
                  className="btn-check"
                  id={`success-outlined_2`}
                  name="assessment"
                  checked={selected === 'COVID'}
                />
                <label
                  className="btn btn-outline-success px-3"
                  htmlFor={`success-outlined_2`}
                >
                  The risk of contracting Covid-19
                </label>
              </div>
            </div>
          </div>
          <hr />
          <div>
            {selected === 'MENTAL' && <MentalHistory />}
            {selected === 'COVID' && <CovidHistory />}
          </div>
        </div>
      </Container>
    </>
  );
};

export default AssessmentHistoryPage;
