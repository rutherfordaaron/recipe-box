import type { AppProps } from 'next/app'
import "../styles/global.css";
import { CookiesProvider } from "react-cookie";
import Layout from '../components/layout/layout';
import { PrivateRoute } from '../components/layout/privateRoute';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CookiesProvider>
      <Layout>
        <PrivateRoute>
          <Component {...pageProps} />
        </PrivateRoute>
      </Layout>
    </CookiesProvider>
  )
}