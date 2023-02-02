import styles from "../public/styles/new-user.module.scss";
import { useRouter } from "next/router";
import Input from "../components/input/input";
import Link from "next/link";
import { useState } from "react";
import { useCookies } from "react-cookie";
import crypto from "crypto";

const Login = () => {
  let [cookie, setCookie] = useCookies(["token"])
  let [username, setUsername] = useState("");
  let [usernameValid, setUsernameValid] = useState(true);
  let [password, setPassword] = useState("");
  let [passwordValid, setPasswordValid] = useState(true);
  let [error, setError] = useState("");

  const router = useRouter();


  const submit = async () => {
    const form = document.querySelector("form");
    if (form && username && password && usernameValid && passwordValid) {
      // form.submit();
      const info = new FormData(form);
      const username = String(info.get("username"));
      const password = String(info.get("password"));

      // Hash the password before passing it to the API
      let hashPassword = crypto.createHash("sha256").update(password).digest("hex");

      // Use the users/login API endpoint to authenticate the user
      // Store the response (a JWT) as a cookie on the client
      fetch(`/api/users/login?username=${username}&password=${hashPassword}`,
        {
          method: "GET",
          headers: {
            "user-data": JSON.stringify({ username: username, password: hashPassword })
          },
          redirect: "follow"
        })
        .then(response => {
          const data = response.json();
          return data;
        })
        .then(data => {
          if (data.token) {
            // Redirect to the main page after successful login
            createCookie(data.token);
            router.push("/")
          } else {
            setError(data.error);
          }

        })
    } else {
      return false;
    }
  }

  const createCookie = (data: string) => {
    setCookie("token", data, {
      path: "/",
      maxAge: 86400,
      sameSite: true
    })
  }

  return (
    <main>
      <form action="/api/users/login" method="POST">
        <h1>Login</h1>
        {error ? <p className={styles.warning}>{error}. Please try again.</p> : ""}
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

export default Login;