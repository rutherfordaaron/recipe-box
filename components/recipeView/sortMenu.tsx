import { AnimatePresence, motion } from "framer-motion";
import { Filter, SortParameter } from "../../util/types";
import { useRouter } from "next/router";

export const SortMenu = (props: { setFilter: Function, filter: Filter, visible: boolean, setVisible: Function }) => {
  const { visible, setVisible, setFilter, filter } = props;
  const sortArr: SortParameter[] = ["New", "Rating", "User"];
  const router = useRouter();
  return (
    <AnimatePresence>
      {visible ?
        <motion.div
          key="sortMenu"
          className={`absolute w-44 top-14 -left-3 md:left-28 bg-sky-50 shadow-lg rounded overflow-hidden flex flex-col z-50`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ spring: 0 }}
        >
          {sortArr.map((el, i) => {
            if (el == "User" && /profile/.test(router.pathname)) return
            return (
              <button
                key={`sortParameter${i}`}
                onClick={e => {
                  const newFilter = { ...filter };
                  newFilter.sort = el;
                  setFilter(newFilter);
                  setVisible(false);
                }}
                className={`${el == filter.sort ? "bg-sky-300" : ""} rounded-none border-b-2 shadow-none border-sky-100`}>
                {el}
              </button>
            )
          })}
        </motion.div> : <></>}
    </AnimatePresence>
  )
}