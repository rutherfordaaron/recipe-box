import getUser from "../../util/getUser";
import { GetServerSideProps, NextPage } from "next";

type PageProps = {
  user: string,
}

const Profile: NextPage<PageProps> = (props) => {
  const user = JSON.parse(props.user);

  return (
    <>
      <p>User: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Created: {user.created}</p>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  return await getUser(context);
}

export default Profile;