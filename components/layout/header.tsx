import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import getUser from "../../util/getUser";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { faUser, faBoxOpen, faBox } from "@fortawesome/free-solid-svg-icons";
import NavLink from "./navLink";

const Header = () => {
  const [cookie] = useCookies(["token"]);
  const router = useRouter();
  const { userData, userError, userIsLoading } = getUser();
  const [authenticated, setAuthenticated] = useState<boolean | null>(false);

  // check authentication any time user data, router path, or authentication token changes
  useEffect(() => {
    if (userIsLoading) {
      setAuthenticated(null);
    } else if (!cookie.token) {
      setAuthenticated(false)
    } else if (userData && userData.user) {
      setAuthenticated(true)
    } else {
      setAuthenticated(false)
    };
  }, [router.pathname, userData, userError, userIsLoading, cookie.token])

  return (
    <header className="bg-sky-200 shadow-md fixed inset-x-0 top-0 z-10 md:z-50">
      <div className="bg-sky-200 flex justify-between items-center p-3 max-w-[1400px] mx-auto gap-4">
        <NavLink href={authenticated && userData && userData.user ? "/profile" : "/login"} text={authenticated && userData && userData.user ? userData.user.username : "Login"} icon={faUser} />

        <motion.nav key={router.pathname} className="flex gap-5 text-sky-500" id="nav">
          <NavLink href="/public-recipes" text="Public Recipes" icon={faBoxOpen} />
          {/* Only show private recipe link if user is authenticated */}
          {authenticated ? <NavLink href="/profile/my-recipe-box" text="Private Recipes" icon={faBox} /> : <></>}
        </motion.nav>
      </div>
    </header>
  )
}

export default Header;