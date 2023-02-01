import styles from "./nav.module.scss";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";

const Nav = () => {
  const [cookie] = useCookies(["token"]);
  const [authenticated, setAuthenticated] = useState(Boolean(cookie.token));

  useEffect(() => {
    setAuthenticated(Boolean(cookie.token));
  })

  return (
    <nav className={styles.nav}>
      <Link href="/">Home</Link>
      <Link href="/profile">{authenticated ? "Profile" : "Log in"}</Link>
    </nav>
  )
}

export default Nav;