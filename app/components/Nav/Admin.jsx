import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Navbar, Nav, Container, Dropdown, SplitButton } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { profileActions } from '../../store';

const Admin = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    dispatch(profileActions.removeProfileState());

    await axios.get(`/auth/logout`).then(() => {
      window.localStorage.removeItem('user');
    });
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  };

  const ProfileComponent = () => (
    <div className="d-flex align-items-center">
      <img
        src="/admin-profile-image.png"
        style={{ backgroundColor: 'white', borderRadius: '50%', width: '35px' }}
        alt="..."
      />
      <span className="text-light text-decoration-none ms-2">Admin</span>
    </div>
  );

  return (
    <Navbar bg="dark" variant="dark border-bottom border-warning">
      <Container>
        <Navbar.Brand>
          <Link href="/admin/dashboard">
            <div className="d-flex align-items-center" role="button">
              <h1
                style={{
                  fontFamily: 'Dancing Script',
                  fontSize: '38px',
                }}
              >
                GlobalPal Admin
              </h1>
            </div>
          </Link>
        </Navbar.Brand>
        <Nav className="ms-auto">
          <div className="d-flex align-items-center">
            <SplitButton variant="dark" title={<ProfileComponent />}>
              <Dropdown.Item>
                <Link href="/admin/dashboard" className="text-decoration-none">
                  <span
                    className="text-dark text-decoration-none"
                    role="button"
                  >
                    dashboard
                  </span>
                </Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <Link href="/admin/doctors" className="text-decoration-none">
                  <span className="text-dark" role="button">
                    manage doctor
                  </span>
                </Link>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>
                <span
                  className="text-decoration-none text-danger"
                  role="button"
                >
                  logout
                </span>
              </Dropdown.Item>
            </SplitButton>
          </div>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Admin;
