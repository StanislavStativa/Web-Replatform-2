import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
/**
 * Rendered in case if we have 404 error
 */
const NotFound = (): JSX.Element => {
  const router = useRouter();
  const [currentUrl, setCurrentUrl] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(`${window.location.origin}/blog`);
    }
  }, [router.asPath]);

  return (
    <>
      <Head>
        <title>Page Not Found</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/Images/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/Images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/Images/favicon-16x16.png" />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="57x57"
          href="/assets/Images/favicon/apple-touch-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="114x114"
          href="/assets/Images/favicon/apple-touch-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="72x72"
          href="/assets/Images/favicon/apple-touch-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="144x144"
          href="/assets/Images/favicon/apple-touch-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="60x60"
          href="/assets/Images/favicon/apple-touch-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="120x120"
          href="/assets/Images/favicon/apple-touch-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="76x76"
          href="/assets/Images/favicon/apple-touch-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon-precomposed"
          sizes="152x152"
          href="/assets/Images/favicon/apple-touch-icon-152x152.png"
        />
        <link
          rel="icon"
          type="image/png"
          href="/assets/Images/favicon/favicon-196x196.png"
          sizes="196x196"
        />
        <link
          rel="icon"
          type="image/png"
          href="/assets/Images/favicon/favicon-96x96.png"
          sizes="96x96"
        />
        <link
          rel="icon"
          type="image/png"
          href="/assets/Images/favicon/favicon-32x32.png"
          sizes="32x32"
        />
        <link
          rel="icon"
          type="image/png"
          href="/assets/Images/favicon/favicon-48x48.png"
          sizes="48x48"
        />
        <link
          rel="icon"
          type="image/png"
          href="/assets/Images/favicon/favicon-16x16.png"
          sizes="16x16"
        />
        <link
          rel="icon"
          type="image/png"
          href="/assets/Images/favicon/favicon-128.png"
          sizes="128x128"
        />
        <link
          rel="icon"
          type="image/png"
          href="/assets/Images/favicon/android-chrome-192x192.png"
          sizes="192x192"
        />
        <link
          rel="icon"
          type="image/png"
          href="/assets/Images/favicon/android-chrome-512x512.png"
          sizes="512x512"
        />
      </Head>

      <div className="general-hero-image flex items-center justify-center md:h-screen p-12 md:p-20 lg:p-40">
        <div>
          <h2 className="mb-8 lg:mb-14 font-latoRegular md:font-latoLight md:text-5xl md:font-light">
            OOPS!
          </h2>
          <div className="mb-10 lg:mb-14">
            <p className="font-latoRegular">
              The page you are looking for cannot be accessed. It may have been removed, had its
              name changed, or may be temporarily unavailable.
              <br />
              If this problem continues, please contact our Customer Service Department for
              assistance at 888-398-6595.
            </p>
          </div>
          <div className="mb-14">
            <a
              className="py-4 px-10 lg:py-6 lg:px-10 border-2 border-dark-gray text-dark-gray rounded-md font-latoRegular hover:font-latoSemiBold"
              href="/"
            >
              Home
            </a>
          </div>

          <a className="text-dark-gray font-latoRegular" title="Visit Our Blog" href={currentUrl}>
            VISIT OUR BLOG &gt;
          </a>
        </div>
      </div>
    </>
  );
};

export default NotFound;
