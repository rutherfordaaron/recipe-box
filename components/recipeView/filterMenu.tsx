import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getUser from "../../util/getUser"
import { Spinner } from "../spinner";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Filter, defaultTags } from "../../util/types";
import Input from "../input";

export const FilterMenu = (props: { showFilterMenu: boolean, setShowFilterMenu: Function, applyFilter: Function, resetFilters: Function, filter: Filter, setFilter: Function }) => {
  const { showFilterMenu, setShowFilterMenu, filter, setFilter, applyFilter, resetFilters } = props;

  let { userData: data, userError: error, userIsLoading: loading } = getUser();
  const [largeScreen, setLargeScreen] = useState(false);

  const addFilterTag = (value: string) => {
    const activeTags = [...filter.tags];
    activeTags.push(value);
    const newFilter = { ...filter }
    newFilter.tags = [...activeTags]
    setFilter(newFilter)
  }

  const removeFilterTag = (value: string) => {
    const activeTags = [...filter.tags];
    const newFilter = { ...filter }
    newFilter.tags = [...activeTags.filter(item => item !== value)]
    setFilter(newFilter);
  }

  useEffect(() => {
    if (window.screen.width >= 768) {
      setShowFilterMenu(true);
      setLargeScreen(true);
    } else {
      setLargeScreen(false);
    }
  })

  return (
    <AnimatePresence>
      {showFilterMenu ?
        <motion.div
          key="filterMenu"
          className={`fixed top-5 bottom-5 rounded-l right-0 bg-sky-50 flex flex-col gap-4 w-3/4 max-w-[500px] px-4 pt-16 md:py-4 max-sm:shadow-2xl md:shadow-none md:relative md:w-full md:h-[50vh] md:justify-start md:rounded shadow z-40`}
          initial={{ opacity: largeScreen ? 1 : 0, x: largeScreen ? 0 : 500 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 500, opacity: 0 }}
          transition={{ spring: 0 }}
        >
          <button onClick={e => setShowFilterMenu(false)} type="button" className="shadow-none absolute top-5 right-5 md:hidden">
            <FontAwesomeIcon icon={faX} />
          </button>
          <p className="text-sky-500 text-xs">Filter by tag:</p>
          {loading ? <Spinner /> : error ? <p>Error: {error.message}</p> :
            <div className="grid grid-cols-2 gap-2 w-full mx-auto">
              {data && data.user && data.user.tags ? data.user.tags.map((el, i) => {
                // Active Tag Filters
                if (filter.tags.find(item => item === el)) return (
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
                  // Active Tag Filters
                  if (filter.tags.find(item => item === el)) return (
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
              onChange={e => {
                const newFilter = { ...filter }
                newFilter.userFilter = e.target.value
                setFilter(newFilter);
              }}
              state={filter.userFilter}
              valid={true}
            />
            <Input
              id="minRating"
              label="Min. Rating (0-5)"
              type="number"
              onChange={e => {
                const newFilter = { ...filter };
                newFilter.minRating = Number(e.target.value)
                setFilter(newFilter)
              }}
              state={filter.minRating == 0 ? "" : filter.minRating}
              valid={true}
              range={[0, 5]}
            />
            <p className="text-sky-500 text-xs">Max Total Time:</p>
            <div className="flex gap-4">
              <Input
                id="maxHours"
                label="Hrs."
                type="number"
                onChange={(e => {
                  const newFilter = { ...filter }
                  const minutes = filter.maxTime % 60;
                  newFilter.maxTime = (Number(e.target.value) * 60) + minutes;
                  setFilter(newFilter);
                })}
                state={filter.maxTime < 60 ? "" : Math.floor(filter.maxTime / 60)}
                valid={true}
                size="small"
              />
              <Input
                id="maxMinutes"
                label="Min."
                type="number"
                onChange={(e => {
                  const newFilter = { ...filter }
                  const hours = Math.floor(filter.maxTime / 60)
                  newFilter.maxTime = Number(e.target.value) + (hours * 60)
                  setFilter(newFilter);
                })}
                state={filter.maxTime % 60 == 0 ? "" : filter.maxTime % 60}
                valid={true}
                size="small"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-center">
            <button type="button" className="mx-auto bg-sky-100 shadow-md" onClick={e => applyFilter()}>Apply filters</button>
            <button type="button" className="mx-auto bg-sky-100 shadow-md" onClick={e => resetFilters()}>Reset filters</button>
          </div>
          <p className="text-sky-50">.</p>
        </motion.div> : <></>}
    </AnimatePresence>
  )
}