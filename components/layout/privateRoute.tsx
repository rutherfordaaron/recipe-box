import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Loading from "../loading";
import getUser from "../../util/getUser";

export const PrivateRoute = (props: { children: JSX.Element }) => {
  const router = useRouter();
  const { userData, userError, userIsLoading } = getUser();
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
      "/sign-up",
    ]

    if (((userData && !userData.user && !userIsLoading) || !cookies.token) && (/public/.test(router.pathname) || !unprotectedRoutes.find(e => e == router.pathname))) {
      redirect();
    }
  }, [cookies.token, userData?.user?.token, userIsLoading])

  if (userIsLoading) return <Loading />
  return props.children
}