import Head from 'next/head';
import Link from 'next/link';

const Custom404 = () => {
  return (
    <>
      <Head>
        <title>Page not found | GlobalPal</title>
        <meta name="description" content="GlobalTube" />
      </Head>
      <div className="container-fluid  bg-dark">
        <div className="text-center text-warning fw-bold">
          <div className="mx-auto mb-3">
            <img
              src="/404.png"
              style={{ width: '500px', hight: '350px' }}
              alt="404"
            />
            <p className="mb-5">Page Not Found</p>
            <p className="my-5">
              It looks like you found a glitch in the matrix...
            </p>
            <Link href="/">
              <button type="button" className="btn btn-outline-warning mb-5">
                ← Back to Home page
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Custom404;
