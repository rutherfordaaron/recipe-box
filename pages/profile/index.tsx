import getUser from "../../util/getUser";
import { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import Loading from "../../components/loading";
import { useRouter } from "next/router";

type PageProps = {
  user: string,
}

const Profile: NextPage<PageProps> = (props) => {
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(props.user);
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      setLoading(false);
    }
  }, [])

  if (loading) {
    return (
      <Loading />
    )
  } else {
    return (
      <>
        <p>User: {user.username}</p>
        <p>Email: {user.email}</p>
        <p>Created: {user.created}</p>
      </>
    )
  }
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  return await getUser(context);
}

export default Profile;