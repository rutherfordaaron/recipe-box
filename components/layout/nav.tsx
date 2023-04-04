import { motion } from "framer-motion"
import { useRouter } from "next/router"

type Props = {
  children: JSX.Element[]
}

const Nav = ({ children }: Props) => {
  const router = useRouter();
  return (
    <motion.nav key={router.pathname} className="hidden absolute top-0 right-0 flex-col bg-sky-300 p-4 pt-10 w-52 shadow-xl" id="nav">
      {children}
    </motion.nav>
  )
}

export default Nav;