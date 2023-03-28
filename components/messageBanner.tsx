import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const MessageBanner = (props: { message: string | string[] | undefined, good: boolean }) => {
  const [show, setShow] = useState(true);
  // const [show, setShow] = useState(Boolean(props.message));
  const good = "bg-emerald-100 text-green-600"
  const bad = "bg-red-200 text-red-600"

  setTimeout(() => {
    setShow(false);
  }, 4000);

  return (
    <AnimatePresence>
      {!props.message || !show ? <></> :
        <motion.div
          key="messagebanner"
          id="messagebanner"
          initial={{ y: 300 }}
          animate={{ y: 0 }}
          exit={{ y: 300 }}
          className={`transition-all fixed flex justify-center items-center gap-4 bottom-12 ${props.good ? good : bad} p-4 w-[80vw] text-center rounded-md shadow-lg right-[10vw]`}
        >
          <p>{props.message.toString()}</p>
        </motion.div>}

    </AnimatePresence>
  )
}

export default MessageBanner