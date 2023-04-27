import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSort } from "@fortawesome/free-solid-svg-icons";
import { SortMenu } from "./sortMenu";
import { FilterMenu } from "./filterMenu";
import Input from "../input";
import { useState } from "react";
import { Filter, Recipe, SortParameter, emptyFilter } from "../../util/types";

const Search = (props: { filter: Filter, setFilter: Function, setNewFilter: Function }) => {
  const { setNewFilter, filter, setFilter } = props;

  let [showSortMenu, setShowSortMenu] = useState(false);
  let [showFilterMenu, setShowFilterMenu] = useState(false);
  let [sort, setSort] = useState<SortParameter>("New");

  const resetFilters = () => {
    setFilter(emptyFilter)
    setNewFilter(emptyFilter);
    // @ts-ignore
    document.getElementById("minRating").innerHTML = ""
    // @ts-ignore
    document.getElementById("maxMinutes").innerHTML = ""
    // @ts-ignore
    document.getElementById("maxHours").innerHTML = ""
    // @ts-ignore
    document.getElementById("search").innerHTML = ""
  }

  const applyFilter = () => {
    setNewFilter(filter);
  }

  return (
    <div className="flex flex-col relative mx-auto gap-0 md:bg-sky-50 md:h-full md:rounded-md md:shadow-md md:overflow-y-scroll w-full md:overflow-x-hidden md:p-4">
      <div className="flex justify-center items-center relative max-w-[350px] mx-auto gap-2">
        <Input
          id="search"
          type="text"
          label="Search"
          onChange={e => {
            const newFilter = { ...filter }
            newFilter.searchQuery = e.target.value;
            setFilter(newFilter);
          }}
          state={filter.searchQuery}
          valid={true}
        />

        <button type="button" className={`hover:bg-sky-200 text-sm shadow-none transition-all ${filter.sort === "New" ? "" : "bg-sky-100"}`} onClick={e => setShowSortMenu(!showSortMenu)}>
          <FontAwesomeIcon icon={faSort} />
        </button>
        <SortMenu filter={filter} setFilter={setFilter} visible={showSortMenu} setVisible={setShowSortMenu} />

        <button type="button" className={`hover:bg-sky-200 md:hidden shadow-none transition-all ${!filter.tags[0] ? "" : "bg-sky-100"}`} onClick={(e => setShowFilterMenu(!showFilterMenu))}>
          <FontAwesomeIcon icon={faFilter} />
        </button>
      </div>
      <FilterMenu showFilterMenu={showFilterMenu} setShowFilterMenu={setShowFilterMenu} filter={filter} setFilter={setFilter} applyFilter={applyFilter} resetFilters={resetFilters} />
    </div>
  )
}

export default Search;