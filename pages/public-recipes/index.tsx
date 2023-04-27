import getPublicRecipes from "../../util/getPublicRecieps";
import { useEffect, useState } from "react";
import { RecipeGrid } from "../../components/recipeView/recipeGrid";
import Search from "../../components/recipeView/search";
import SearchAndGridWrapper from "../../components/recipeView/searchAndGridWrapper";
import { Filter, emptyFilter, Recipe } from "../../util/types";
import { Spinner } from "../../components/spinner";

export default function PublicRecipes() {
  const [filter, setFilter] = useState<Filter>(emptyFilter)
  const [newFilter, setNewFilter] = useState<Filter>(emptyFilter)

  const { publicRecipesData: data, publicRecipesError: error, publicRecipesIsLoading: loading } = getPublicRecipes(newFilter);
  let [recipes, setRecipes] = useState<Recipe[]>(data && data.recipes ? data.recipes : []);

  useEffect(() => {
    if (data && data.recipes) {
      setRecipes(data.recipes)
    } else {
      setRecipes([])
    }
  }, [data])

  if (error) return <p>Error: {error.message}</p>

  return (
    <>
      <h1 className="text-center">Public Recipes</h1>
      <SearchAndGridWrapper>
        <Search filter={filter} setFilter={setFilter} setNewFilter={setNewFilter} />
        {loading ? <Spinner /> : <RecipeGrid isLoading={loading} recipes={recipes} />}
      </SearchAndGridWrapper>
    </>
  )
}