import Head from 'next/head';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import CovidAssessmentForm from '../../components/Assessment/CovidAssessmentForm';

const CovidAssessmentPage = () => {
  const profileSlice = useSelector((state) => state.profileSlice);
  return (
    <>
      <Head>
        <title>Covid Assessment | {profileSlice.role}</title>
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
          <h2>Covid-19 infection risk assessment form</h2>
          <hr />
          <div className="px-3">
            <CovidAssessmentForm />
          </div>
        </div>
      </Container>
    </>
  );
};

export default CovidAssessmentPage;
