import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const Verification = () => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (router.query.token) {
      setToken(router.query.token);
    }
  }, [router.query.token]);

  const handleVerifyEmail = async () => {
    try {
      const { data } = await axios.patch(`/auth/verify`, {
        token,
      });
      toast(data.msg);
      setIsVerified(true);
    } catch (e) {
      toast.error(e.response.data.msg);
    }
  };

  return (
    <div className="bg-dark vh-100 p-5">
      <div
        style={{
          width: '23rem',
          height: '25rem',
        }}
        className="bg-light rounded-3 mx-auto p-4 d-flex justify-content-between flex-column mt-4"
      >
        <div className="text-break overflow-auto">
          <h2>Email verification</h2>
          <h5>Los Angeles blizzard warning is first since 1989</h5>Parts of
          usually balmy southern California are under their first blizzard
          warning since 1989. Forecasters are predicting record snowfall of up
          to 8ft (2.4m) in mountains to the east of Los Angeles by Saturday. A
          massive storm has already brought major blizzards and temperatures
          below freezing to much of the northern US. The cold snap comes as
          parts of the US southeast basked in a record-breaking heat wave. The
          icy weather front stretches along the entire US West Coast, as well as
          the Canadian province of British Columbia.
        </div>
        <div className="p-3">
          <Button
            variant="outline-primary w-100"
            onClick={handleVerifyEmail}
            disabled={isVerified}
          >
            {isVerified ? 'Verified' : 'Verify'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Verification;
