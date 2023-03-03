import axios from 'axios';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ClearQuestionModal from '../../../components/Admin/ClearQuestionModal';
import useEffectOnce from '../../../hooks/useEffectOnce';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useRouter } from 'next/router';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};
const mainLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const labels = [];
const today = (new Date().getDay() % 7) - 1;

for (let i = today + 1; i < mainLabels.length; i++) {
  labels.push(mainLabels[i]);
}
for (let i = 0; i < today; i++) {
  labels.push(mainLabels[i]);
}
labels.push(mainLabels[today]);

const AdminDashboardPage = () => {
  const { name, role } = useSelector((state) => state.profileSlice);
  const [isShow, setIsShow] = useState(false);
  const [unansweredQuestionsStat, setUnansweredQuestionStat] = useState([]);
  const [registerUsersStat, setRegisterUsersStat] = useState([]);
  const router = useRouter();
  useEffect(() => {
    if (role !== 'ADMIN') {
      router.push('/login');
    }
  }, [role]);

  const openModal = () => {
    setIsShow(true);
  };

  const closeModal = () => {
    setIsShow(false);
  };

  const fetchAggregation = async () => {
    try {
      const { data } = await axios.get(`/admin/aggregate`);
      setUnansweredQuestionStat(data.unansweredStatistic);
      setRegisterUsersStat(data.registerUserStatistic);
    } catch (err) {
      toast.error(err.response.data.msg);
    }
  };

  useEffectOnce(() => {
    fetchAggregation();
  });

  const data1 = {
    labels,
    datasets: [
      {
        label: 'Number of Questions',
        data: labels.map((item, index) =>
          unansweredQuestionsStat[index]
            ? unansweredQuestionsStat[index].count
            : 0
        ),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };
  const data2 = {
    labels,
    datasets: [
      {
        label: 'number of users',
        data: labels.map((item, index) =>
          registerUsersStat[index] ? registerUsersStat[index].count : 0
        ),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <>
      <Head>
        <title>Admin | {name} | GlobalPal</title>
        <meta name="description" content="GlobalPal Service" />
      </Head>
      <Container className="shadow-sm">
        <ClearQuestionModal
          isShow={isShow}
          onCloseClearQuestionModal={closeModal}
          onFetchAggregationHandler={fetchAggregation}
        />
        <div className="text-end">
          <button className="btn btn-danger" onClick={openModal}>
            Clear questions
          </button>
        </div>
        <div className="mt-3 d-flex">
          <div className="w-50 text-center">
            <Line options={options} data={data1} />
            <h5 className="text-secondary mt-3">
              The statistics of questions that were not answered by doctors
            </h5>
          </div>
          <div className="w-50 text-center">
            <Line options={options} data={data2} />
            <h5 className="text-secondary mt-3">Statistics of subscriptions</h5>
          </div>
        </div>
      </Container>
    </>
  );
};

export default AdminDashboardPage;
