import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const MessageBanner = () => {
  const router = useRouter();
  const [show, setShow] = useState(true);
  const good = "bg-emerald-100 text-green-600"
  const bad = "bg-red-200 text-red-600"

  useEffect(() => {
    if (router.query.message) {
      setShow(true);
    }
    setTimeout(() => {
      setShow(false);
    }, 4000);
  }, [router.asPath])

  return (
    <AnimatePresence>
      {!router.query.message || !show ? <></> :
        <motion.div
          key="messagebanner"
          id="messagebanner"
          initial={{ y: 300 }}
          animate={{ y: 0 }}
          exit={{ y: 300 }}
          className={`transition-all fixed flex justify-center items-center gap-4 bottom-12 ${router.query.good && router.query.good !== "false" ? good : bad} p-4 w-[80vw] text-center rounded-md shadow-lg right-[10vw]`}
        >
          <p>{router.query.message?.toString()}</p>
        </motion.div>}

    </AnimatePresence>
  )
}

export default MessageBanner