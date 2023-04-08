import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSort } from "@fortawesome/free-solid-svg-icons";
import { SortMenu } from "./sortMenu";
import { FilterMenu } from "./filterMenu";
import Input from "./input";
import { useState, useEffect } from "react";
import { Recipe, SortParameter } from "../util/types";

const Search = (props: { recipeData: Recipe[] | null | undefined, recipes: Recipe[], setRecipes: Function, publicRoute?: boolean }) => {
  const { recipeData, recipes, setRecipes, publicRoute } = props;

  let [showSortMenu, setShowSortMenu] = useState(false);
  let [showFilterMenu, setShowFilterMenu] = useState(false);
  let [searchQuery, setSearchQuery] = useState("");
  let [sort, setSort] = useState<SortParameter>(SortParameter.Unsorted);
  let [tagFilter, setTagFilter] = useState<string[]>([]);

  useEffect(() => setRecipes(sortRecipes()), [searchQuery, sort, tagFilter, recipeData])

  const filterSearchQuery = () => {
    if (recipeData) {
      const searchFiltered = recipeData.filter(item => new RegExp(searchQuery, "i").test(item.name));
      let filtered = [...searchFiltered];
      for (let i = 0; i < tagFilter.length; i++) {
        filtered = filtered.filter(item => item.tags?.find(item => item == tagFilter[i]));
      }

      return filtered;
    }
    return [];
  }

  const sortRecipes = () => {
    switch (sort) {
      case SortParameter.Descending:
        return filterSearchQuery().sort().reverse()
      case SortParameter.Ascending:
        return filterSearchQuery().sort()
      case SortParameter.RecentlyCreated:
        return filterSearchQuery().sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
      case SortParameter.OldestCreated:
        return filterSearchQuery().sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime())
      case SortParameter.OldestUpdated:
        return filterSearchQuery().sort((a, b) => new Date(a.updated ? a.updated : a.created).getTime() - new Date(b.updated ? b.updated : b.created).getTime())
      case SortParameter.RecentlyUpdated:
        return filterSearchQuery().sort((a, b) => new Date(b.updated ? b.updated : b.created).getTime() - new Date(a.updated ? a.updated : a.created).getTime())
      default:
        return filterSearchQuery()
    }
  }

  return (
    <div className="flex justify-center items-center relative max-w-[350px] mx-auto gap-2">
      <Input id="search" type="text" label="Search" onChange={e => setSearchQuery(e.target.value)} state={searchQuery} valid={true} />

      <button type="button" className={`hover:bg-sky-200 shadow-none transition-all ${!tagFilter[0] ? "" : "bg-sky-100"}`} onClick={(e => setShowFilterMenu(!showFilterMenu))}>
        <FontAwesomeIcon icon={faFilter} />
      </button>
      <FilterMenu tagFilter={tagFilter} setTagFilter={setTagFilter} showFilterMenu={showFilterMenu} setShowFilterMenu={setShowFilterMenu} />

      <button type="button" className={`hover:bg-sky-200 shadow-none transition-all ${sort === SortParameter.Unsorted ? "" : "bg-sky-100"}`} onClick={e => setShowSortMenu(!showSortMenu)}>
        <FontAwesomeIcon icon={faSort} />
      </button>
      <SortMenu setSort={setSort} activeSortParameter={sort} visible={showSortMenu} setVisible={setShowSortMenu} />
    </div>
  )
}

export default Search;