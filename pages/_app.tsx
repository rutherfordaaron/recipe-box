import type { AppProps } from 'next/app'
import "../styles/global.css";
import { CookiesProvider } from "react-cookie";
import Layout from '../components/layout/layout';
import { PrivateRoute } from '../components/layout/privateRoute';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const unprotectedRoutes = [
    "/",
    "/login",
    "/sign-up",
  ]

  if (/public/.test(router.pathname) || unprotectedRoutes.find(e => e == router.pathname)) {
    return (
      <CookiesProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CookiesProvider>
    )
  }

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