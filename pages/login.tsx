import styles from "../public/styles/new-user.module.scss";
import { useRouter } from "next/router";
import Input from "../components/input/input";
import Link from "next/link";
import { useState } from "react";
import { useCookies } from "react-cookie";

const Login = () => {
  let [cookie, setCookie] = useCookies(["user"])
  let [username, setUsername] = useState("");
  let [usernameValid, setUsernameValid] = useState(true);
  let [password, setPassword] = useState("");
  let [passwordValid, setPasswordValid] = useState(true);

  // get any errors thrown from the API by accessing URL parameters
  const router = useRouter();
  const { error } = router.query;
  let parsedError: string;
  if (error && typeof error === "string") {
    parsedError = error.split("-").join(" ");
  } else {
    parsedError = ""
  }

  const submit = async () => {
    const form = document.querySelector("form");
    if (form && username && password && usernameValid && passwordValid) {
      // form.submit();
      const info = new FormData(form);
      const username = info.get("username");
      const password = info.get("password");

      fetch(`/api/users/login?username=${username}&password=${password}`,
        { method: "POST", body: JSON.stringify({ username: username, password: password }) })
        .then(response => response.json())
        .then(data => createCookie(data.token));

    } else {
      return false;
    }
  }

  const createCookie = (data: string) => {
    setCookie("user", data, {
      path: "/",
      maxAge: 3600,
      sameSite: true
    })
  }

  return (
    <main>
      <form action="/api/users/login" method="POST">
        <h1>Login</h1>
        {parsedError ? <p className={styles.warning}>{parsedError}. Please try again.</p> : ""}
        <Input
          id="username"
          type="text"
          label="Username"
          onChange={(e) => {
            setUsername(e.target.value);
            e.target.value ? setUsernameValid(true) : setUsernameValid(false)
          }}
          state={username}
          valid={usernameValid}
        />
        <Input
          id="password"
          type="password"
          label="Password"
          onChange={(e) => {
            setPassword(e.target.value)
            e.target.value ? setPasswordValid(true) : setPasswordValid(false)
          }}
          state={password}
          valid={passwordValid}
        />
        <button
          type="button"
          className={usernameValid && username && password && passwordValid ? "" : styles.invalidButton}
          onClick={submit}
        >Submit
        </button>
        <p className={styles.link}>New user? <Link href="/sign-up">Sign up</Link> for a free account!</p>
      </form>
    </main>
  )
}

// type Data = {
//   user: string
// }

// export const getServerSideProps: GetServerSideProps<{ data: Data }> = (context) => {
//   console.log(context.req);
//   const data = parseCookie(context.req);
//   console.log("cookie: ", data);
//   return { props: data }
// }

export default Login;