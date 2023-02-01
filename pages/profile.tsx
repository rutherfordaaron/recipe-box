import { useCookies } from "react-cookie";
import Router from "next/router";
import getUser from "../util/getUser";
import { GetServerSideProps, NextPage } from "next";

type PageProps = {
  user: string,
}

const Profile: NextPage<PageProps> = (props) => {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const user = JSON.parse(props.user);

  const logout = () => {
    removeCookie("token");
    Router.push("/login");
  }

  return (
    <>
      <p>User: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Created: {user.created}</p>
      <button type="button" onClick={logout}>Log out</button>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  const user = await getUser(context);
  const data: PageProps = {
    user: JSON.stringify(user)
  }

  if (typeof user === "object" && user !== null) {
    return { props: data }
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      }
    };
  }
}

export default Profile;