import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSort } from "@fortawesome/free-solid-svg-icons";
import { SortMenu } from "./sortMenu";
import { FilterMenu } from "./filterMenu";
import Input from "../input";
import { useEffect, useState } from "react";
import { Filter, Recipe, SortParameter, emptyFilter } from "../../util/types";

const Search = (props: { recipeData: Recipe[] | null | undefined, setRecipes: Function, publicRoute?: boolean, filter: Filter, setFilter: Function }) => {
  const { recipeData, setRecipes, publicRoute, filter, setFilter } = props;

  let [showSortMenu, setShowSortMenu] = useState(false);
  let [showFilterMenu, setShowFilterMenu] = useState(false);
  let [sort, setSort] = useState<SortParameter>(SortParameter.Unsorted);

  const resetFilters = () => {
    setFilter(emptyFilter)
    setRecipes(sortRecipes(emptyFilter))
    // @ts-ignore
    document.getElementById("minRating").innerHTML = ""
    // @ts-ignore
    document.getElementById("maxMinutes").innerHTML = ""
    // @ts-ignore
    document.getElementById("maxHours").innerHTML = ""
    // @ts-ignore
    document.getElementById("search").innerHTML = ""
  }

  const filterSearchQuery = (filter: Filter) => {
    if (recipeData) {
      // Filter reicpe array by users search query
      const searchFiltered = recipeData.filter(item => new RegExp(filter.searchQuery, "i").test(item.name));
      // Only show recipes that match all provided tags
      let filtered = [...searchFiltered];
      for (let i = 0; i < filter.tags.length; i++) {
        filtered = filtered.filter(item => item.tags?.find(item => item == filter.tags[i]));
      }
      // If user filter input, only show recipes by provided user (not case sensitive)
      if (filter.userFilter) {
        filtered = (filtered.filter(item => new RegExp(filter.userFilter, "i").test(item.owner)));
      }

      // Filter by minimum rating
      filtered = filtered.filter(item => {
        let sum = 0;
        for (let i = 0; i < item.ratings.length; i++) {
          sum += item.ratings[i].rating
        }
        const average = sum / item.ratings.length / 2
        return average >= (filter.minRating ? filter.minRating : 0)
      })
      // Filter by max time
      filtered = filtered.filter(item => {
        const cooktime = item.cookTime ? item.cookTime : 0
        const prepTime = item.prepTime ? item.prepTime : 0
        const recipeTime = cooktime + prepTime;
        return item.cookTime ? recipeTime <= (filter.maxTime > 0 ? filter.maxTime : Infinity) : false
      });

      return filtered;
    }
    return [];
  }

  const sortRecipes = (filter: Filter) => {
    switch (sort) {
      case SortParameter.Descending:
        return filterSearchQuery(filter).sort((a, b) => b.name.localeCompare(a.name)).reverse()
      case SortParameter.Ascending:
        return filterSearchQuery(filter).sort((a, b) => b.name.localeCompare(a.name))
      case SortParameter.RecentlyCreated:
        return filterSearchQuery(filter).sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
      case SortParameter.OldestCreated:
        return filterSearchQuery(filter).sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime())
      case SortParameter.OldestUpdated:
        return filterSearchQuery(filter).sort((a, b) => new Date(a.updated ? a.updated : a.created).getTime() - new Date(b.updated ? b.updated : b.created).getTime())
      case SortParameter.RecentlyUpdated:
        return filterSearchQuery(filter).sort((a, b) => new Date(b.updated ? b.updated : b.created).getTime() - new Date(a.updated ? a.updated : a.created).getTime())
      default:
        return filterSearchQuery(filter).sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
    }
  }

  const applyFilter = () => {
    setRecipes(sortRecipes(filter))
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

        <button type="button" className={`hover:bg-sky-200 text-sm shadow-none transition-all ${sort === SortParameter.Unsorted ? "" : "bg-sky-100"}`} onClick={e => setShowSortMenu(!showSortMenu)}>
          <FontAwesomeIcon icon={faSort} />
        </button>
        <SortMenu setSort={setSort} activeSortParameter={sort} visible={showSortMenu} setVisible={setShowSortMenu} />

        <button type="button" className={`hover:bg-sky-200 md:hidden shadow-none transition-all ${!filter.tags[0] ? "" : "bg-sky-100"}`} onClick={(e => setShowFilterMenu(!showFilterMenu))}>
          <FontAwesomeIcon icon={faFilter} />
        </button>
      </div>
      <FilterMenu showFilterMenu={showFilterMenu} setShowFilterMenu={setShowFilterMenu} filter={filter} setFilter={setFilter} applyFilter={applyFilter} resetFilters={resetFilters} />
    </div>
  )
}

export default Search;