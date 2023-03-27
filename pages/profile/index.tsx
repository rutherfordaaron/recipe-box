import getUser from "../../util/getUser";
import Loading from "../../components/loading";

const Profile = () => {
  let { userData, userError, userIsLoading } = getUser();

  if (userIsLoading) return <Loading />
  if (userError) return <p>Something went wrong! {userError.message}</p>

  if (userData && userData.user) return (
    <>
      <p>User: {userData.user.username}</p>
      <p>Email: {userData.user.email}</p>
      <p>Created: {userData.user.created.toString()}</p>
    </>
  )
}

export default Profile;