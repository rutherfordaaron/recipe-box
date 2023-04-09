import getPublicRecipes from "../../util/getPublicRecieps";
import Loading from "../../components/loading";
import { useState } from "react";
import { RecipeGrid } from "../../components/recipeGrid";
import Search from "../../components/search";
import SearchAndGridWrapper from "../../components/searchAndGridWrapper";

export default function PublicRecipes() {
  const { publicRecipesData: data, publicRecipesError: error, publicRecipesIsLoading: loading } = getPublicRecipes();
  let [recipes, setRecipes] = useState([]);
  if (loading) return <Loading />
  if (error) return <p>Error: {error.message}</p>

  return (
    <>
      <h1 className="text-center">Public Recipes</h1>
      <SearchAndGridWrapper>
        <Search recipeData={data?.recipes} recipes={recipes} setRecipes={setRecipes} />
        <RecipeGrid isLoading={loading} recipes={recipes} />
      </SearchAndGridWrapper>
    </>
  )
}