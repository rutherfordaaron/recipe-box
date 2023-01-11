import styles from "../public/styles/new-user.module.scss";
import { useRouter } from "next/router";
import Input from "../components/input/input";
import Link from "next/link";
import { useState } from "react";

const Login = () => {
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

  const submit = () => {
    const form = document.querySelector("form");
    if (form && username && password && usernameValid && passwordValid) {
      form.submit();
    }
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
          type="submit"
          className={usernameValid && username && password && passwordValid ? "" : styles.invalidButton}
          onSubmit={submit}
        >Submit
        </button>
        <p className={styles.link}>New user? <Link href="/sign-up">Sign up</Link> for a free account!</p>
      </form>
    </main>
  )
}

export default Login