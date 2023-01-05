import { useState } from "react"
import Input from "../components/input/input";
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
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");
  let [passwordMatch, setPasswordMatch] = useState(true);
  let [passwordStrength, setPasswordStrength] = useState(Strength.Weak);
  let [valid, setValid] = useState(true);

  // Check the strength of the password via regex
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

  // if password is not weak and matches, submit the form (attempt to create new user)
  const validate = () => {
    const form = document.querySelector("form");
    if (passwordStrength !== Strength.Weak && passwordMatch && form) {
      setValid(true);
      form.submit();
    } else {
      setValid(false);
    }
  }

  return (
    <main>
      <form action="/api/users/new-user" method="POST" id="form" className={valid ? "" : "invalid"}>
        <h1>New User</h1>
        <Input
          id="user"
          type="text"
          label="Username"
          onChange={(e) => setUsername(e.target.value)}
          state={username}
          valid={valid}
        />
        <Input
          id="email"
          type="email"
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
          state={email}
          valid={valid}
        />

        <div className={
          `${styles.warning} 
          ${styles.passReq} 
          ${valid ? styles.hidden : ""}`
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
          valid={valid}
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
          valid={valid}
        />
        <p className={styles.warning}>{passwordMatch ? "" : "Passwords must match"}</p>

        <button type="button" onClick={validate}>Submit</button>
      </form>
    </main>
  )
}