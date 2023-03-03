import axios from 'axios';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import AddDoctorModal from '../../components/Doctor/AddDoctorModal';
import DoctorItem from '../../components/Doctor/DoctorItem';
import DoctorProfile from '../../components/Doctor/DoctorProfile';
import useEffectOnce from '../../hooks/useEffectOnce';
import { useRouter } from 'next/router';

const AdminDoctorManagementPage = () => {
  const { name, role } = useSelector((state) => state.profileSlice);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDoctorProfile, setSelectedDoctorProfile] = useState(null);
  const [isShow, setIsShow] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (role !== 'ADMIN') {
      router.push('/login');
    }
  }, [role]);

  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get(`/admin/doctors`);
      setDoctors(data.doctors);
    } catch (e) {
      toast.error(e.response.data.msg);
    }
  };

  useEffectOnce(() => {
    fetchDoctors();
  });

  const removeDoctor = async (id) => {
    const answer = window.confirm(`Do you want to delete this doctor?`);

    if (answer) {
      try {
        const { data } = await axios.delete(`/admin/doctors/${id}`);
        toast.success(data.msg);
        setDoctors(doctors.filter((doctor) => doctor.id !== id));
        if (selectedDoctor === id) {
          setSelectedDoctor(null);
          setSelectedDoctorProfile(null);
        }
      } catch (err) {
        toast.error(err.response.data.msg);
      }
    }
  };

  const fetchSpecifiedDoctor = async (id) => {
    try {
      const { data } = await axios.get(`/admin/doctors/${id}`);
      setSelectedDoctor(data.doctor.id);
      setSelectedDoctorProfile(data.doctor);
    } catch (err) {
      toast.error(err.response.data.msg);
    }
  };

  useEffectOnce(() => {
    fetchSpecifiedDoctor();
  });

  const openModal = () => {
    setIsShow(true);
  };

  const closeModal = () => {
    setIsShow(false);
  };

  return (
    <>
      <Head>
        <title>| {name} | Doctor Management |</title>
        <meta name="description" content="GlobalPal Service" />
      </Head>
      <Container>
        <AddDoctorModal
          openModal={isShow}
          closeModal={closeModal}
          onSetDoctors={setDoctors}
        />
        <div className="d-flex w-100">
          <div
            className="shadow-sm border border-warning rounded-3 p-3"
            style={{
              width: '60%',
              height: '45rem',
              overflowY: 'scroll',
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <h2>Manage a doctor</h2>
              <button
                className="btn btn-outline-primary ms-2"
                onClick={openModal}
              >
                Add doctor
              </button>
            </div>
            <hr />
            <div className="px-2 mb-2">
              {doctors.map((doctor) => (
                <DoctorItem
                  doctor={doctor}
                  key={doctor.id}
                  onSetSelectedDoctor={fetchSpecifiedDoctor}
                  onDeleteDoctor={removeDoctor}
                />
              ))}
            </div>
          </div>
          <div
            className="ms-3 shadow-sm border border-warning rounded-3 px-1 py-3"
            style={{
              width: '40%',
              height: '42rem',
            }}
          >
            {selectedDoctor ? (
              <DoctorProfile doctor={selectedDoctorProfile} />
            ) : (
              <div className="w-100 text-center">
                <span>-- Please select a doctor --</span>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default AdminDoctorManagementPage;
