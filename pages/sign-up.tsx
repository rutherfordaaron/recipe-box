import { useState } from "react"

export default function signUp() {
  // Strength type to make sure strength is always one of these 3 values
  enum Strength {
    Weak = "weak",
    Medium = "medium",
    Strong = "strong"
  }

  // State for form validation
  let [password, setPassword] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");
  let [passwordMatch, setPasswordMatch] = useState(true);
  let [passwordStrength, setPasswordStrength] = useState(Strength.Weak);

  // Check the strength of the password via regex
  const checkStrength = (password: string) => {
    setPassword(password);
    const strong = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;
    const medium = /((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))/;

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
      form.submit();
    }
  }

  return (
    <main>
      <h1>Enter your information below</h1>
      <form action="/api/users/new-user" method="POST" id="form">
        <label htmlFor="user">User Name:</label>
        <input
          required
          type="text"
          id="user"
          name="user"
        />

        <label htmlFor="email">Email:</label>
        <input
          required
          type="email"
          id="email"
          name="email"
        />

        <p>Password Rules:</p>
        <ul>
          <li>At least 8 characters long.</li>
          <li>At least one uppercase letter</li>
          <li>At least one lowercase letter</li>
          <li>At least one digit (0-9)</li>
          <li>The password has at least one special character</li>
        </ul>

        <label htmlFor="pass">Password:</label>
        <input
          required
          type="password"
          id="pass"
          name="pass"
          onChange={(e) => { checkStrength(e.target.value); checkMatch(confirmPassword, e.target.value) }}
        />
        <p>Strength: {passwordStrength}</p>

        <label htmlFor="pass">Confirm Password:</label>
        <input
          required
          type="password"
          id="confirm-pass"
          name="confirm-pass"
          onChange={(e) => { setConfirmPassword(e.target.value); checkMatch(e.target.value); }}
        />
        <p>{passwordMatch ? "" : "Passwords must match"}</p>

        <button type="button" onClick={validate}>Submit</button>
      </form>
    </main>
  )
}