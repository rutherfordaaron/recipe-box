// import styles from "./header.module.scss";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { Children, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion"
import Nav from "./nav/nav";

const Header = () => {
  const [cookie] = useCookies(["token"]);
  const [authenticated, setAuthenticated] = useState(Boolean(cookie.token));
  const [listener, setListener] = useState(false);

  useEffect(() => {
    setAuthenticated(Boolean(cookie.token));
  })

  const linkClass = "hover:text-sky-800 hover:scale-110 my-2 transition-all"

  const notAuthenticated =
    <Nav>
      <Link className={linkClass} href="/login">Login</Link>
      <Link className={linkClass} href="/sign-up">Sign Up</Link>
    </Nav>

  const isAuthenticated =
    <Nav>
      <Link className={linkClass} href="/profile/my-recipe-box">My Recipe Box</Link>
      {/* <Link className={linkClass} href="/profile/favorites">Favorite Recipes</Link>
      <Link className={linkClass} href="/profile/meal-plan">Meal Plan</Link>
      <Link className={linkClass} href="/profile/grocery-list">Grocery List</Link>
      <Link className={linkClass} href="/profile/friends">Friends</Link>
      <Link className={linkClass} href="/profile">Profile</Link> */}
      <Link className={linkClass} href="/profile/settings">Settings</Link>
    </Nav>

  const toggleNav = () => {
    const nav = document.getElementById("nav");
    const body = document.querySelector("body");
    if (nav && body) {
      if (!listener) {
        setListener(true);
        nav.classList.remove("hidden");
        nav.classList.add("flex");

        setTimeout(() => {
          body.addEventListener("click", () => {
            nav.classList.add("hidden")
            nav.classList.remove("flex")
            setListener(false);
          }, { once: true })
        }, 10)
      }
    }
  }

  return (
    <header className="bg-sky-200 flex justify-between items-center p-3 shadow-md text-xl font-bold fixed inset-x-0 top-0 z-10">
      <Link href="/" className="">Recipe Box</Link>

      <motion.button
        className="hover:cursor-pointer z-20 border-none hover:bg-inherit"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        <FontAwesomeIcon icon={faBars} className="hover:cursor-pointer" onClick={toggleNav} />
      </motion.button>

      {authenticated ? isAuthenticated : notAuthenticated}
    </header>
  )
}

export default Header;