import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { toast } from 'react-toastify';

const DoctorProfilePage = () => {
  const router = useRouter();
  const [profile, setProfile] = useState({
    interested_in: [],
    url: '',
  });

  const fetchProfile = async (id) => {
    try {
      const { data } = await axios.get(`/profile/doctors/${id}`);

      setProfile(data);
    } catch (err) {
      toast.error(err.response.data.msg);
    }
  };

  useEffect(() => {
    if (router.query.doctor_id) {
      fetchProfile(router.query.doctor_id);
    }
  }, [router.query.doctor_id]);

  return (
    <Container>
      <div className="vh-100 bg-dark my-3 border border-warning">
        <div className="d-flex mx-5 px-5 bg-light rounded-3 py-5 mt-3">
          <div
            style={{
              width: '35%',
            }}
          >
            <img
              src={profile.url}
              style={{
                width: '75%',
                objectFit: 'cover',
                borderRadius: '50%',
                margin: '0 auto',
              }}
              alt="..."
            />
          </div>
          <div
            style={{
              width: '65%',
            }}
          >
            <h1>Doctor profile</h1>
            <hr />
            <div>
              <p className="fs-4">{profile.name}</p>
              <span>{profile.personal_information}</span>
            </div>
            <div className="mt-3">
              <span className="fs-5">Attention</span>
              <div className="d-flex flex-wrap">
                {profile.interested_in.map((topic) => (
                  <button
                    className="btn btn-outlin   e-success m-1 px-3"
                    key={topic.topic_id}
                  >
                    {topic.topic}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default DoctorProfilePage;
