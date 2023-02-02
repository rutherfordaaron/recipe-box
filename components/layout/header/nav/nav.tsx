import { motion } from "framer-motion"
import styles from "./nav.module.scss";

type Props = {
  children: JSX.Element[]
}

const Nav = ({ children }: Props) => {
  return (
    <motion.nav className={`${styles.nav} hidden`} id="nav">
      {children}
    </motion.nav>
  )
}

export default Nav;