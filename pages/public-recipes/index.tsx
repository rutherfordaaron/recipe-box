import getPublicRecipes from "../../util/getPublicRecieps";
import { useState } from "react";
import { RecipeGrid } from "../../components/recipeView/recipeGrid";
import Search from "../../components/recipeView/search";
import SearchAndGridWrapper from "../../components/recipeView/searchAndGridWrapper";
import { Filter, emptyFilter, Recipe } from "../../util/types";
import { Spinner } from "../../components/spinner";
import { useRouter } from "next/router";

export default function PublicRecipes() {
  const router = useRouter();

  const { publicRecipesData: data, publicRecipesError: error, publicRecipesIsLoading: loading } = getPublicRecipes(router.query.filter ? JSON.parse(router.query.filter.toString()) : emptyFilter);

  let [recipes, setRecipes] = useState<Recipe[]>(data && data.recipes ? data.recipes : []);
  const [filter, setFilter] = useState<Filter>(emptyFilter)



  if (error) return <p>Error: {error.message}</p>

  return (
    <>
      <h1 className="text-center">Public Recipes</h1>
      <SearchAndGridWrapper>
        <Search recipeData={data?.recipes} setRecipes={setRecipes} filter={filter} setFilter={setFilter} />
        {loading ? <Spinner /> : <RecipeGrid isLoading={loading} recipes={recipes} />}
      </SearchAndGridWrapper>
    </>
  )
}