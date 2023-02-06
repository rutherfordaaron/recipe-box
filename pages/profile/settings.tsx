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
    fetch("/api/users/remove-user", { method: "DELETE" })
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
    }
  }
  return (
    <>
      <button type="button" onClick={logout}>Log out</button>
      <button type="button" onClick={toggleConfirmation}>Delete Profile</button>
      <div className={`${styles.confirmDeleteWrapper} hidden`} id="confirmDelete">
        <div className={styles.confirmDelete}>
          <p>Are you sure you want to delete your profile?</p>
          <p className={`warning`}>This cannot be undone.</p>
          <div className={styles.confirmDeleteButtonWrapper} >
            <button className="warning" type="button" onClick={deleteUser}>Yes</button>
            <button type="button" onClick={toggleConfirmation}>No</button>
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