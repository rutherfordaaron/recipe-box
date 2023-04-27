import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Loading from "../loading";
import getUser from "../../util/getUser";

export const PrivateRoute = (props: { children: JSX.Element }) => {
  const router = useRouter();
  const { userData, userError, userIsLoading } = getUser();
  const [cookies] = useCookies(["token"]);

  // Redirect to login page when attempting to view private data when not authenticated
  const redirect = () => {
    router.push({
      pathname: "/login",
      query: {
        message: "Please login before viewing this page",
        good: false,
        // Return to private route or as close as possible
        returnTo: router.pathname.replace(/recipe\/\[id\]/, "").replace(/public-recipes\/\[id\]/, "public-recipes")
      }
    }, "/login");
  }

  // Recheck if a reroute is needed anytime userData.user changes
  useEffect(() => {
    while (userIsLoading) { }
    if (((userData && !userData.user && !userIsLoading) || !cookies.token)) redirect();
  }, [])

  if (userIsLoading) return <Loading />
  return props.children
}