import { Html, Head, Main, NextScript } from 'next/document';

const googleTagManagerId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;
const googleLocationApiKey = process.env.NEXT_GOOGLE_LOCATION_KEY;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${googleLocationApiKey}&libraries=places`}
          async
          defer
        ></script>
      </Head>
      <body data-pin-hover="true">
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
            title="Google Tag Manager"
          ></iframe>
        </noscript>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
