import { useCookies } from "react-cookie";
import Router from "next/router";
import getUser from "../../util/getUser";
import { GetServerSideProps, NextPage } from "next";
import styles from "../../public/styles/profile.module.scss";

type PageProps = {
  user: string,
}

const Settings: NextPage<PageProps> = (props) => {
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  const user = JSON.parse(props.user);

  const logout = () => {
    removeCookie("token", { path: "/" });
    Router.push("/login");
  }

  const deleteUser = async () => {
    fetch("/api/users", { method: "DELETE" })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          logout();
        } else {
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
  return (
    <>
      <button
        type="button"
        className="block my-3 border hover:bg-gray-200"
        onClick={logout}
      >
        Log out
      </button>
      <button
        type="button"
        className="block my-3 border hover:bg-gray-200"
        onClick={toggleConfirmation}
      >
        Delete Profile
      </button>
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

export default Settings;