import { useState, useEffect, Dispatch, SetStateAction } from "react"
import { useRouter } from "next/router";
import Input from "../components/input/input";
import Link from "next/link";

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
    <>
      <form action="/api/users/new-user" method="POST" id="form" className="flex flex-col align-middle">
        <h1 className="text-center mb-3">New User</h1>
        {parsedError ? <p className="text-sm text-red-500">{parsedError}. Please try again.</p> : ""}

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

        <div className="border rounded shadow-md bg-sky-200 text-sm p-4 w-max mx-auto">
          <p className="font-semibold text-center mb-2">Password Requirements:</p>
          <ul>
            <li>At least 6 characters long.</li>
            <li>At least one uppercase letter</li>
            <li>At least one lowercase letter</li>
            <li>At least one digit (0-9)</li>
            <li>At least one special character</li>
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
            `text-xs text-center mx-auto rounded-lg transition-all h-[16px]
            ${passwordStrength === Strength.Strong ? "bg-green-400 w-32" :
              passwordStrength === Strength.Medium ? "bg-orange-400 w-24" : "bg-red-400 w-16"}
            ${password === "" ? "opacity-0" : ""}`
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
        <p className="text-sm text-center text-red-400 h-[20px]">{passwordMatch ? "" : "Passwords must match"}</p>

        <button
          type="button"
          onClick={validate}
          className={`
            ${emailValid && usernameValid && passwordMatch && passwordStrength !== Strength.Weak && email && username && password ? "bg-blue-300 text-black shadow-lg top-[-10px]"
              : "bg-slate-200 text-gray-300 hover:cursor-not-allowed top-0"} 
            w-max px-6 py-2 rounded mx-auto font-bold relative transition-all mt-4`}
        >Submit
        </button>
        <p className="text-sm text-center my-3">Already have an account? <Link className="text-blue-400 underline" href="/login">Login here</Link>.</p>
      </form>
    </>
  )
}