import { useCookies } from "react-cookie";
import { useState } from "react";
import Router from "next/router";
import getUser from "../../util/getUser";
import Loading from "../../components/loading";

const Settings = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const { userData, userError, userIsLoading } = getUser();
  const [loading, setLoading] = useState(false);

  const logout = () => {
    setLoading(true);
    removeCookie("token", { path: "/" });
    Router.push({ pathname: "/login", query: { message: "Successfully logged out", good: true } });
  }

  const deleteUser = async () => {
    setLoading(true);
    fetch("/api/users", { method: "DELETE" })
      .then(response => response.json())
      .then(data => {
        if (!data.error) {
          logout();
        } else {
          setLoading(true);
          Router.push("/profile?error=something-went-wrong");
        }
      })
  }

  const toggleConfirmation = () => {
    const element = document.getElementById("confirmDelete");
    if (element) {
      element.classList.toggle("hidden");
      element.classList.toggle("flex");
    }
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
        onClick={logout}
      >
        Log out
      </button>
      {/* ---------- DELETE USER BUTTON ---------- */}
      <button
        type="button"
        className="block my-3 border hover:bg-gray-200"
        onClick={toggleConfirmation}
      >
        Delete Profile
      </button>
      {/* ---------- DELETE USER CONFIRMATION CONTAINER ---------- */}
      <div className="hidden fixed p-4 inset-0 bg-gray-100 top-0 right-0 flex-col justify-center align-middle" id="confirmDelete">
        <div className="text-center">
          <p>Are you sure you want to delete your profile?</p>
          <p className="text-sm text-red-400 text-center my-2">This cannot be undone.</p>
          <div className="flex justify-center gap-3 my-2" >
            <button
              className="text-red-400 border hover:bg-rose-200" type="button" onClick={deleteUser}
            >
              Yes, delete my profile
            </button>
            <button type="button" className="border hover:bg-gray-200" onClick={toggleConfirmation}>No, I changed my mind</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Settings;