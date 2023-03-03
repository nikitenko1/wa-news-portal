import Head from 'next/head';
import { useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import MentalHealthAssessmentForm from '../../components/Assessment/MentalHealthAssessmentForm';

const MentalHealthAssessmentPage = () => {
  const profileSlice = useSelector((state) => state.profileSlice);
  return (
    <>
      <Head>
        <title> Mental Health Assessment | {profileSlice.role}</title>
        <meta name="description" content="GlobalPal Service" />
      </Head>
      <Container>
        <div
          className="px-5 mx-5 mt-3 bg-light rounded-3 py-3 border shadow-sm border-warning"
          style={{
            height: '45rem',
            overflowY: 'scroll',
          }}
        >
          <h2>Mental health assessment form</h2>
          <hr />
          <div className="px-3">
            <MentalHealthAssessmentForm />
          </div>
        </div>
      </Container>
    </>
  );
};

export default MentalHealthAssessmentPage;
