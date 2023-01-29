import type { AppProps } from 'next/app'
import "../public/styles/global.scss";
import Nav from '../components/nav/nav';
import { CookiesProvider } from "react-cookie";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CookiesProvider>
      <Nav />
      <Component {...pageProps} />
    </CookiesProvider>
  )
}