import { useState, useEffect, Dispatch, SetStateAction } from "react"
import { useRouter } from "next/router";
import Input from "../components/input/input";
import Link from "next/link";
import styles from "../public/styles/new-user.module.scss";

export default function signUp() {
  // Strength type to make sure strength is always one of these 3 values
  enum Strength {
    Weak = "weak",
    Medium = "medium",
    Strong = "strong"
  }

  // State for form validation
  let [email, setEmail] = useState("");
  let [emailValid, setEmailValid] = useState(true);
  let [username, setUsername] = useState("");
  let [usernameValid, setUsernameValid] = useState(true);
  let [password, setPassword] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");
  let [passwordMatch, setPasswordMatch] = useState(true);
  let [passwordStrength, setPasswordStrength] = useState<null | Strength>(null);

  // get any errors thrown from the API by accessing URL parameters
  const router = useRouter();
  const { error } = router.query;
  let parsedError: string;
  if (error && typeof error === "string") {
    parsedError = error.split("-").join(" ");
  } else {
    parsedError = ""
  }

  // Check to ensure valid email
  const checkEmail = (email: string) => {
    setEmail(email);
    const emailTest = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    if (emailTest.test(email)) {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
  }

  // Check username to ensure it's valid
  const checkUsername = (username: string) => {
    setUsername(username);
    if (username === "") {
      setUsernameValid(false);
    } else {
      setUsernameValid(true);
    }
  }

  // Check and set the strength of the password via regex
  const checkStrength = (password: string) => {
    setPassword(password);
    const strong = /^(?=(.*[a-z]){3,})(?=(.*[A-Z]){2,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/;
    const medium = /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{6,}$/;

    if (strong.test(password)) {
      setPasswordStrength(Strength.Strong);
    } else if (medium.test(password)) {
      setPasswordStrength(Strength.Medium);
    } else {
      setPasswordStrength(Strength.Weak);
    }
  }

  // Make sure passwords in both fields match
  const checkMatch = (confirmPassword: string, OPassword: string = password) => {
    if (OPassword !== confirmPassword) {
      setPasswordMatch(false);
    } else {
      setPasswordMatch(true);
    }
  }

  // if password is not weak and matches, submit the form (attempt to create the new user)
  const validate = () => {
    const form = document.querySelector("form");
    if (password && passwordMatch && emailValid && usernameValid && form) {
      form.submit();
    }
  }

  return (
    <main>
      <form action="/api/users/new-user" method="POST" id="form">
        <h1>New User</h1>
        {parsedError ? <p className={styles.warning}>{parsedError}. Please try again.</p> : ""}

        <Input
          id="user"
          type="text"
          label="Username"
          onChange={(e) => checkUsername(e.target.value)}
          state={username}
          valid={usernameValid}
        />

        <Input
          id="email"
          type="email"
          label="Email"
          onChange={(e) => checkEmail(e.target.value)}
          state={email}
          valid={emailValid}
        />

        <div className={
          `${styles.warning} 
          ${styles.passReq} 
          ${passwordStrength !== Strength.Weak ? styles.hidden : ""}`
        }>
          <p>Password Requirements:</p>
          <ul>
            <li>At least 6 characters long.</li>
            <li>At least one uppercase letter</li>
            <li>At least one lowercase letter</li>
            <li>At least one digit (0-9)</li>
            <li>The password has at least one special character</li>
          </ul>
        </div>


        <Input
          id="pass"
          type="password"
          label="Password"
          onChange={(e: any) => {
            checkStrength(e.target.value);
            checkMatch(confirmPassword, e.target.value)
          }}
          state={password}
          valid={passwordStrength === Strength.Weak && password !== "" ? false : true}
        />

        <p
          className={
            `${passwordStrength === Strength.Weak ? styles.weak :
              passwordStrength === Strength.Medium ? styles.medium :
                styles.strong} ${styles.strength}
            ${password === "" ? styles.hidden : ""}`
          }
        >
          {passwordStrength}
        </p>

        <Input
          id="confirm-pass"
          type="password"
          label="Confirm Password"
          onChange={(e: any) => {
            setConfirmPassword(e.target.value);
            checkMatch(e.target.value);
          }}
          state={confirmPassword}
          valid={passwordMatch}
        />
        <p className={styles.warning}>{passwordMatch ? "" : "Passwords must match"}</p>

        <button
          type="button"
          onClick={validate}
          className={emailValid && usernameValid && passwordMatch && passwordStrength !== Strength.Weak && email && username && password ? "" : styles.invalidButton}
        >Submit
        </button>
        <p className={styles.link}>Already have an account? <Link href="/login">Login here</Link>.</p>
      </form>
    </main>
  )
}