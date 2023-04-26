import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSort } from "@fortawesome/free-solid-svg-icons";
import { SortMenu } from "./sortMenu";
import { FilterMenu } from "./filterMenu";
import Input from "../input";
import { useState, useEffect } from "react";
import { Recipe, SortParameter } from "../../util/types";

const Search = (props: { recipeData: Recipe[] | null | undefined, recipes: Recipe[], setRecipes: Function, publicRoute?: boolean }) => {
  const { recipeData, recipes, setRecipes, publicRoute } = props;

  let [showSortMenu, setShowSortMenu] = useState(false);
  let [showFilterMenu, setShowFilterMenu] = useState(false);
  let [searchQuery, setSearchQuery] = useState("");
  let [sort, setSort] = useState<SortParameter>(SortParameter.Unsorted);
  let [tagFilter, setTagFilter] = useState<string[]>([]);
  let [userFilter, setUserFilter] = useState("");
  let [minRating, setMinRating] = useState<"" | number>("");
  let [maxHours, setMaxHours] = useState<"" | number>("")
  let [maxMinutes, setMaxMinutes] = useState<"" | number>("");
  useEffect(() => setRecipes(sortRecipes()), [searchQuery, sort, tagFilter, recipeData, userFilter, minRating, maxHours, maxMinutes])

  const filterSearchQuery = () => {
    if (recipeData) {
      // Filter reicpe array by users search query
      const searchFiltered = recipeData.filter(item => new RegExp(searchQuery, "i").test(item.name));
      // Only show recipes that match all provided tags
      let filtered = [...searchFiltered];
      for (let i = 0; i < tagFilter.length; i++) {
        filtered = filtered.filter(item => item.tags?.find(item => item == tagFilter[i]));
      }
      // If user filter input, only show recipes by provided user (not case sensitive)
      if (userFilter) {
        filtered = (filtered.filter(item => new RegExp(userFilter, "i").test(item.owner)));
      }

      // Filter by minimum rating
      filtered = filtered.filter(item => {
        let sum = 0;
        for (let i = 0; i < item.ratings.length; i++) {
          sum += item.ratings[i].rating
        }
        const average = sum / item.ratings.length / 2
        return average >= (minRating ? minRating : 0)
      })
      // Filter by max time
      filtered = filtered.filter(item => {
        const timeFilter = maxMinutes ? maxMinutes : 0 + (maxHours ? maxHours * 60 : 0);
        const cooktime = item.cookTime ? item.cookTime : 0
        const prepTime = item.prepTime ? item.prepTime : 0
        const recipeTime = cooktime + prepTime;
        return item.cookTime ? recipeTime <= (timeFilter > 0 ? timeFilter : Infinity) : false
      });

      return filtered;
    }
    return [];
  }

  const sortRecipes = () => {
    switch (sort) {
      case SortParameter.Descending:
        return filterSearchQuery().sort((a, b) => b.name.localeCompare(a.name)).reverse()
      case SortParameter.Ascending:
        return filterSearchQuery().sort((a, b) => b.name.localeCompare(a.name))
      case SortParameter.RecentlyCreated:
        return filterSearchQuery().sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
      case SortParameter.OldestCreated:
        return filterSearchQuery().sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime())
      case SortParameter.OldestUpdated:
        return filterSearchQuery().sort((a, b) => new Date(a.updated ? a.updated : a.created).getTime() - new Date(b.updated ? b.updated : b.created).getTime())
      case SortParameter.RecentlyUpdated:
        return filterSearchQuery().sort((a, b) => new Date(b.updated ? b.updated : b.created).getTime() - new Date(a.updated ? a.updated : a.created).getTime())
      default:
        return filterSearchQuery().sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
    }
  }

  return (
    <div className="flex flex-col relative mx-auto gap-0 md:bg-sky-50 md:h-full md:rounded-md md:shadow-md md:overflow-y-scroll w-full md:overflow-x-hidden md:p-4">
      <div className="flex justify-center items-center relative max-w-[350px] mx-auto gap-2">
        <Input id="search" type="text" label="Search" onChange={e => setSearchQuery(e.target.value)} state={searchQuery} valid={true} />

        <button type="button" className={`hover:bg-sky-200 text-sm shadow-none transition-all ${sort === SortParameter.Unsorted ? "" : "bg-sky-100"}`} onClick={e => setShowSortMenu(!showSortMenu)}>
          <FontAwesomeIcon icon={faSort} />
        </button>
        <SortMenu setSort={setSort} activeSortParameter={sort} visible={showSortMenu} setVisible={setShowSortMenu} />

        <button type="button" className={`hover:bg-sky-200 md:hidden shadow-none transition-all ${!tagFilter[0] ? "" : "bg-sky-100"}`} onClick={(e => setShowFilterMenu(!showFilterMenu))}>
          <FontAwesomeIcon icon={faFilter} />
        </button>
      </div>
      <FilterMenu tagFilter={tagFilter} setTagFilter={setTagFilter} showFilterMenu={showFilterMenu} setShowFilterMenu={setShowFilterMenu} userFilter={userFilter} setUserFilter={setUserFilter} minRating={minRating} setMinRating={setMinRating} maxHours={maxHours} setMaxHours={setMaxHours} maxMinutes={maxMinutes} setMaxMinutes={setMaxMinutes} />
    </div>
  )
}

export default Search;