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

  const notAuthenticated =
    <Nav>
      <Link href="/login">Login</Link>
      <Link href="/sign-up">Sign Up</Link>
    </Nav>

  const isAuthenticated =
    <Nav>
      <Link href="/profile/my-recipe-box">My Recipe Box</Link>
      <Link href="/profile/favorites">Favorite Recipes</Link>
      <Link href="/profile/meal-plan">Meal Plan</Link>
      <Link href="/profile/grocery-list">Grocery List</Link>
      <Link href="/profile/friends">Friends</Link>
      <Link href="/profile">Profile</Link>
      <Link href="/profile/settings">Settings</Link>
    </Nav>

  const toggleNav = () => {
    const nav = document.getElementById("nav");
    const body = document.querySelector("body");
    if (nav && body) {
      if (!listener) {
        setListener(true);
        nav.classList.remove("hidden");

        setTimeout(() => {
          body.addEventListener("click", () => {
            nav.classList.add("hidden")
            setListener(false);
          }, { once: true })
        }, 10)
      }
    }
  }

  return (
    <header className="bg-green-300 flex justify-between p-2">
      <Link href="/" className="">Recipe Box</Link>

      <motion.button
        className=""
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        <FontAwesomeIcon icon={faBars} className="" onClick={toggleNav} />
      </motion.button>

      {authenticated ? isAuthenticated : notAuthenticated}
    </header>
  )
}

export default Header;