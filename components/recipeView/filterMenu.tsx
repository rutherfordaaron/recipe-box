import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getUser from "../../util/getUser"
import { Spinner } from "../spinner";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { defaultTags } from "../../util/types";
import Input from "../input";

export const FilterMenu = (props: { showFilterMenu: boolean, setShowFilterMenu: Function, tagFilter: string[], setTagFilter: Function, userFilter: string, setUserFilter: Function }) => {
  const { showFilterMenu, setShowFilterMenu, tagFilter, setTagFilter, userFilter, setUserFilter } = props;
  let { userData: data, userError: error, userIsLoading: loading } = getUser();

  const addFilterTag = (value: string) => {
    const activeTags = [...tagFilter];
    activeTags.push(value);
    setTagFilter(activeTags)
  }

  const removeFilterTag = (value: string) => {
    const activeTags = [...tagFilter];
    setTagFilter(activeTags.filter(item => item !== value));
  }

  const resetFilters = () => {
    setTagFilter([]);
    setUserFilter("");
  }

  useEffect(() => {
    if (window.screen.width >= 768) {
      setShowFilterMenu(true);
    }
  })

  return (
    <AnimatePresence>
      {showFilterMenu ?
        <motion.div
          key="filterMenu"
          className={`fixed top-5 bottom-5 rounded-l right-0 bg-sky-50 flex flex-col gap-4 w-3/4 max-w-[500px] px-4 pt-16 md:py-4 max-sm:shadow-2xl md:relative md:w-full md:rounded shadow z-40`}
          initial={{ opacity: 0, x: 500 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 500, opacity: 0 }}
          transition={{ spring: 0 }}
        >
          <button onClick={e => setShowFilterMenu(false)} type="button" className="shadow-none absolute top-5 right-5 md:hidden">
            <FontAwesomeIcon icon={faX} />
          </button>
          <p>Filter by tag:</p>
          {loading ? <Spinner /> : error ? <p>Error: {error.message}</p> :
            <div className="grid grid-cols-2 gap-2 w-full mx-auto">
              {data && data.user && data.user.tags ? data.user.tags.map((el, i) => {
                // Active Tag Filters
                if (tagFilter.find(item => item === el)) return (
                  <button
                    key={`tagFilter${i}`}
                    className={`bg-sky-300 shadow`}
                    onClick={e => removeFilterTag(el)}
                  >
                    {el}
                  </button>
                )
                // Inactive Tag Filters
                return (
                  <button
                    key={`tagFilter${i}`}
                    className={`bg-sky-100 shadow`}
                    onClick={e => addFilterTag(el)}
                  >
                    {el}
                  </button>
                )
              }) :
                defaultTags.map((el, i) => {
                  console.log("mapping default tags");
                  // Active Tag Filters
                  if (tagFilter.find(item => item === el)) return (
                    <button
                      key={`tagFilter${i}`}
                      className={`bg-sky-300 shadow`}
                      onClick={e => removeFilterTag(el)}
                    >
                      {el}
                    </button>
                  )
                  // Inactive Tag Filters
                  return (
                    <button
                      key={`tagFilter${i}`}
                      className={`bg-sky-100 shadow`}
                      onClick={e => addFilterTag(el)}
                    >
                      {el}
                    </button>
                  )
                })}
            </div>}
          <div className="flex flex-col justify-center items-center">
            <Input
              id="userFilter"
              label="Recipe Owner"
              type="text"
              onChange={e => setUserFilter(e.target.value)}
              state={userFilter}
              valid={true}
            />
          </div>
          <button type="button" className="mx-auto" onClick={resetFilters}>Reset filters</button>
        </motion.div> : <></>}
    </AnimatePresence>
  )
}