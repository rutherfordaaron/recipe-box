import { AnimatePresence, motion } from "framer-motion";
import { SortParameter } from "../../util/types";

export const SortMenu = (props: { setSort: Function, activeSortParameter: SortParameter, visible: boolean, setVisible: Function }) => {
  const { setSort, activeSortParameter, visible, setVisible } = props;
  const sortArr = [SortParameter.Unsorted, SortParameter.Ascending, SortParameter.Descending, SortParameter.RecentlyCreated, SortParameter.RecentlyUpdated, SortParameter.OldestCreated, SortParameter.OldestUpdated]
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
            return (
              <button key={`sortParameter${i}`} onClick={e => {
                setSort(el);
                setVisible(false);
              }} className={`${el == activeSortParameter ? "bg-sky-300" : ""} rounded-none border-b-2 shadow-none border-sky-100`}>
                {el}
              </button>
            )
          })}
        </motion.div> : <></>}
    </AnimatePresence>
  )
}