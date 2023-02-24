import { motion } from "framer-motion"

type Props = {
  children: JSX.Element[]
}

const Nav = ({ children }: Props) => {
  return (
    <motion.nav className="hidden absolute top-0 right-0 flex-col bg-sky-300 p-4 pt-10 w-52 shadow-xl" id="nav">
      {children}
    </motion.nav>
  )
}

export default Nav;