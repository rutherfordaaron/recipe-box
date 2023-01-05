import styles from "./nav.module.scss";
import Link from "next/link";

const Nav = () => {
  return (
    <nav className={styles.nav}>
      <Link href="/">Home</Link>
      <Link href="/login">Login</Link>
    </nav>
  )
}

export default Nav;