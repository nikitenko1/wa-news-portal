import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import NextNProgress from 'nextjs-progressbar';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import Nav from '../components/Nav/Nav';
import store from '../store';

const App = ({ children }) => {
  const [showChild, setShowChild] = useState(false);

  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }
  if (typeof window === 'undefined') {
    return <></>;
  } else {
    return <>{children}</>;
  }
};

// global axios defaults
axios.defaults.baseURL = 'http://localhost:8000/api';
// axios.defaults.headers.post['Content-Type'] = 'application/json';
// cookies
axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  (request) => {
    // console.log(request);
    // Edit request config
    return request;
  },
  (error) => {
    // eslint-disable-next-line no-undef
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    // Edit response config
    return response;
  },
  (error) => {
    // eslint-disable-next-line no-undef
    return Promise.reject(error);
  }
);

const MyApp = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <App>
        <NextNProgress
          color="#ffbb00"
          startPosition={0.2}
          stopDelayMs={500}
          height={4}
          showOnShallow={true}
        />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          pauseOnFocusLoss={false}
          draggable
        />
        <Nav />
        <Component {...pageProps} />
      </App>
    </Provider>
  );
};

export default MyApp;
