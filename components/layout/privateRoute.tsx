import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Loading from "../loading";
import getUser from "../../util/getUser";

export const PrivateRoute = (props: { children: JSX.Element }) => {
  const router = useRouter();
  const { userData, userError, userIsLoading } = getUser();
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies(["token"]);

  const redirect = () => {
    router.push({
      pathname: "/login",
      query: {
        message: "Please login before viewing this page",
        good: false,
        returnTo: router.pathname
      }
    }, "/login");
  }

  useEffect(() => {
    const unprotectedRoutes = [
      "/",
      "/login",
      "/sign-up"
    ]

    setLoading(false);
    if (((userData && !userData.user) || !cookies.token) && !unprotectedRoutes.find(e => e == router.pathname)) {
      redirect();
      setLoading(true);
    }
  }, [router.pathname, cookies.token, userData, userIsLoading])

  if (userIsLoading) return <Loading />
  return (
    <>
      {loading ? <Loading /> : props.children}
    </>
  )
}