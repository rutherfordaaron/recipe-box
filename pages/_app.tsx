import type { AppProps } from 'next/app'
import "../public/styles/global.scss";
import Nav from '../components/nav/nav';
import { useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  let [loggedIn, setLoggedIn] = useState(false);
  return (
    <>
      <Nav />
      <Component {...pageProps} />
    </>
  )
}
