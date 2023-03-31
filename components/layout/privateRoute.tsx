import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Loading from "../loading";

export const PrivateRoute = (props: { children: JSX.Element }) => {
  const router = useRouter();
  const [path, setPath] = useState(router.pathname);
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState(props.children)
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;

  const unprotectedRoutes = [
    "/",
    "/login",
    "/signup"
  ]

  useEffect(() => {
    setLoading(false);
    setPath(router.pathname);
    if (!token && !unprotectedRoutes.find(e => e == router.pathname)) {
      setLoading(true);
      router.push({
        pathname: "/login",
        query: {
          message: "Please login before viewing this page",
          good: false,
          returnTo: router.pathname
        }
      }, "/login");

    }

  })

  return (
    <>
      {loading ? <Loading /> : props.children}
    </>
  )
}