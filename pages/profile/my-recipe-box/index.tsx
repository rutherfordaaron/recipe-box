import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Loading from "../../../components/loading";
import getUserRecipes from "../../../util/getUserRecipes";
import { useState } from "react";
import Search from "../../../components/search";
import { RecipeGrid } from "../../../components/recipeGrid";

const MyRecipeBox = () => {
  let { userRecipesData: data, userRecipesError: error, userRecipesIsLoading: isLoading } = getUserRecipes();
  let [recipes, setRecipes] = useState([]);
  if (isLoading) return <Loading />
  if (error) return <p>Error: {error.message}</p>
  return (
    <>
      <Search recipeData={data?.recipes} recipes={recipes} setRecipes={setRecipes} />
      {/* ---------- RECIPE GRID ---------- */}
      <h1 className="text-center">My Recipe Box</h1>
      <RecipeGrid recipes={recipes} isLoading={isLoading} />

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