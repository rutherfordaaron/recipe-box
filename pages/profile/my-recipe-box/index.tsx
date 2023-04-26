import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Loading from "../../../components/loading";
import getUserRecipes from "../../../util/getUserRecipes";
import { useState } from "react";
import Search from "../../../components/recipeView/search";
import { RecipeGrid } from "../../../components/recipeView/recipeGrid";
import SearchAndGridWrapper from "../../../components/recipeView/searchAndGridWrapper";
import { Filter, Recipe, emptyFilter } from "../../../util/types";
import { Spinner } from "../../../components/spinner";

const MyRecipeBox = () => {
  let { userRecipesData: data, userRecipesError: error, userRecipesIsLoading: isLoading } = getUserRecipes();

  const [filter, setFilter] = useState<Filter>(emptyFilter)
  let [recipes, setRecipes] = useState<Recipe[]>(data && data.recipes ? data.recipes : []);

  if (error) return <p>Error: {error.message}</p>

  return (
    <>
      <h1 className="text-center">My Recipe Box</h1>
      <SearchAndGridWrapper>
        <Search recipeData={data?.recipes} setRecipes={setRecipes} filter={filter} setFilter={setFilter} />
        {isLoading ? <Spinner /> : <RecipeGrid recipes={recipes} isLoading={isLoading} />}
      </SearchAndGridWrapper>

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
    </>
  )


}

export default MyRecipeBox;