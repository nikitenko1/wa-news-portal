import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <>
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="/favicon/apple-touch-icon.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/favicon/favicon-32x32.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/favicon/favicon-16x16.png"
            />
            <link rel="manifest" href="/favicon/site.webmanifest" />
            <link
              rel="mask-icon"
              href="/favicon/safari-pinned-tab.svg"
              color="#5bbad5"
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap"
              rel="stylesheet"
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap"
              rel="stylesheet"
            />

            <meta name="apple-mobile-web-app-title" content="Snippit" />
            <meta name="application-name" content="GlobalPal Service" />
            <meta name="msapplication-TileColor" content="#ffc40d" />
            <meta name="theme-color" content="#ffffff" />
          </>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
