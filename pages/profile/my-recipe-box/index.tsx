import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Loading from "../../../components/loading";
import RecipeCard from "../../../components/RecipeCard";
import getUserRecipes from "../../../util/getUserRecipes";
import { useState } from "react";
import Input from "../../../components/input";
import { Recipe, SortParameter } from "../../../util/types";
import { faSort, faFilter } from "@fortawesome/free-solid-svg-icons";
import { SortMenu } from "../../../components/sortMenu";
import { FilterMenu } from "../../../components/filterMenu";

const MyRecipeBox = () => {
  let [searchQuery, setSearchQuery] = useState("");
  let [sort, setSort] = useState<SortParameter>(SortParameter.Ascending);
  let [showSortMenu, setShowSortMenu] = useState(false);
  let [tagFilter, setTagFilter] = useState<string[]>([]);
  let [showFilterMenu, setShowFilterMenu] = useState(false);

  let { userRecipesData: data, userRecipesError: error, userRecipesIsLoading: isLoading } = getUserRecipes();

  const filterSearchQuery = () => {
    if (data && data.recipes) return data.recipes.filter(item => new RegExp(searchQuery, "i").test(item.name));
    return [];
  }

  const mapRecipeCards = (arr: Recipe[]) => {
    return arr.map((el, i) => {
      return (
        <RecipeCard
          recipe={el}
          key={el._id?.toString()}
        />
      )
    })
  }

  const getRecipeCards = () => {
    switch (sort) {
      case SortParameter.Descending:
        return mapRecipeCards(filterSearchQuery().sort().reverse())
      case SortParameter.RecentlyCreated:
        return mapRecipeCards(filterSearchQuery().sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()))
      case SortParameter.OldestCreated:
        return mapRecipeCards(filterSearchQuery().sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()))
      case SortParameter.OldestUpdated:
        return mapRecipeCards(filterSearchQuery().sort((a, b) => new Date(a.updated ? a.updated : a.created).getTime() - new Date(b.updated ? b.updated : b.created).getTime()))
      case SortParameter.RecentlyUpdated:
        return mapRecipeCards(filterSearchQuery().sort((a, b) => new Date(b.updated ? b.updated : b.created).getTime() - new Date(a.updated ? a.updated : a.created).getTime()))
      default:
        return mapRecipeCards(filterSearchQuery())
    }
  }

  if (isLoading) return <Loading />
  if (error) return <p>Error: {error.message}</p>
  return (
    <>
      <div className="max-w-[1000px] mx-auto">

        {/* ---------- SEARCH, FILTER, AND SORT ---------- */}
        <div className="flex justify-center items-center relative">
          <button type="button" className="shadow-none" onClick={e => setShowSortMenu(!showSortMenu)}>
            <FontAwesomeIcon icon={faSort} />
          </button>
          <SortMenu setSort={setSort} activeSortParameter={sort} visible={showSortMenu} setVisible={setShowSortMenu} />
          <Input id="search" type="text" label="Search" onChange={e => setSearchQuery(e.target.value)} state={searchQuery} valid={true} />
          <FilterMenu tagFilter={tagFilter} setTagFilter={setTagFilter} showFilterMenu={showFilterMenu} setShowFilterMenu={setShowFilterMenu} />
          <button type="button" className="shadow-none" onClick={(e => setShowFilterMenu(!showFilterMenu))}>
            <FontAwesomeIcon icon={faFilter} />
          </button>
        </div>

        {/* ---------- RECIPE GRID ---------- */}
        <h1 className="text-center">My Recipe Box</h1>
        <div className="flex flex-col md:grid lg:grid-cols-2 justify-center items-center gap-4">
          {getRecipeCards()}
        </div>

        {/* ---------- NEW RECIPE BUTTON ---------- */}
        <Link
          className="fixed bottom-5 right-5 text-5xl bg-sky-200 shadow-md w-20 h-20
       flex justify-center items-center rounded-full 
       hover:bg-sky-300 hover:shadow-none hover:bottom-4 hover:text-gray-800 
       transition-all"
          href="./my-recipe-box/new-recipe"
        >
          <FontAwesomeIcon icon={faPlus} />
        </Link>
      </div>
    </>
  )


}

export default MyRecipeBox;