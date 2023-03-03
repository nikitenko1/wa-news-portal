import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import SearchBar from '../Searching/SearchBar';
import { Navbar, Nav, Container } from 'react-bootstrap';

const Unauthorized = () => {
  const router = useRouter();
  const [pathname, setPathname] = useState('/');

  useEffect(() => {
    setPathname(router.pathname);
  }, [router.pathname]);
  return (
    <Navbar bg="dark" variant="dark" className="mb-2">
      <Container>
        <Navbar.Brand>
          <Link href="/" className="text-warning">
            <div className="d-flex align-items-center" role="button">
              <h1
                style={{
                  fontFamily: 'Dancing Script',
                  fontSize: '38px',
                }}
              >
                GlobalPal
              </h1>
            </div>
          </Link>
        </Navbar.Brand>

        <div className="w-100">
          <SearchBar />
        </div>
        <Nav className="ms-auto">
          <div className="d-flex align-items-center justify-content-between">
            <Link href="/login" className="text-decoration-none text-light">
              <span
                className={`${
                  pathname === '/login' && 'fw-bolder text-warning'
                }`}
                role="button"
              >
                Login
              </span>
            </Link>
            <Link href="/register" className="text-decoration-none text-light">
              <span
                className={`ms-3 ${
                  pathname === '/register' && 'fw-bolder text-warning'
                }`}
                role="button"
              >
                Register
              </span>
            </Link>
          </div>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Unauthorized;
