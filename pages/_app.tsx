import type { AppProps } from 'next/app'
import "../public/styles/global.scss";
import { CookiesProvider } from "react-cookie";
import Layout from '../components/layout/layout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CookiesProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CookiesProvider>
  )
}