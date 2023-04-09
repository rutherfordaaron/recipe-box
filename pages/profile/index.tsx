import { useCookies } from "react-cookie";
import { useState } from "react";
import Router from "next/router";
import getUser from "../../util/getUser";
import Loading from "../../components/loading";
import { DestructiveAction } from "../../components/destructiveAction";

const Profile = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const { userData, userError, userIsLoading } = getUser();
  const [loading, setLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const logout = (remove?: boolean) => {
    setLoading(true);
    Router.push({ pathname: !remove ? "/login" : "/", query: { message: !remove ? "Successfully logged out" : "User successfully deleted", good: true } }, !remove ? "/login" : "/");
    removeCookie("token", { path: "/" });
  }

  const deleteUser = async () => {
    setLoading(true);
    fetch("/api/users", { method: "DELETE" })
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
          logout(true);
        } else {
          setLoading(false);
          Router.push({ pathname: "/login", query: { message: `Error: ${data.message}. Please try again.` } });
        }
      })
  }

  if (userIsLoading) return <Loading />
  if (userError) return <p>Something went wrong! {userError.message}</p>
  if (userData && userData.user === null) Router.push("/login");
  if (loading) return <Loading />
  return (
    <>
      <h1>Hello, {userData && userData.user ? userData.user.username : "unkown user"}</h1>
      {/* ---------- LOGOOUT BUTTON ---------- */}
      <button
        type="button"
        className="block my-3 border hover:bg-gray-200"
        onClick={e => logout()}
      >
        Log out
      </button>
      {/* ---------- DELETE USER BUTTON ---------- */}
      <button
        type="button"
        className="block my-3 border hover:bg-gray-200"
        onClick={e => setDeleteConfirmation(true)}
      >
        Delete Profile
      </button>
      {/* ---------- DELETE USER CONFIRMATION CONTAINER ---------- */}
      {!deleteConfirmation ? <></> : <DestructiveAction message="Are you sure you want to delete your profile and all recipes associated with it?" destroyMessage="Yes, delete my profile" cancelMessage="No, nevermind" setVisible={setDeleteConfirmation} destructiveAction={deleteUser} />
      }
    </>
  )
}

export default Profile;