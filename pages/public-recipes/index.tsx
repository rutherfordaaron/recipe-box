import RecipeCard from "../../components/RecipeCard";
import getPublicRecipes from "../../util/getPublicRecieps";
import Loading from "../../components/loading";
import { useState } from "react";
import { RecipeGrid } from "../../components/recipeGrid";
import Search from "../../components/search";

export default function PublicRecipes() {
  const { publicRecipesData: data, publicRecipesError: error, publicRecipesIsLoading: loading } = getPublicRecipes();
  let [recipes, setRecipes] = useState([]);
  if (loading) return <Loading />
  if (error) return <p>Error: {error.message}</p>

  return (
    <>
      <Search recipeData={data?.recipes} recipes={recipes} setRecipes={setRecipes} />
      <h1>Public Recipes</h1>
      <RecipeGrid isLoading={loading} recipes={recipes} />
    </>
  )
}