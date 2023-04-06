import RecipeCard from "../../components/RecipeCard";
import getPublicRecipes from "../../util/getPublicRecieps";
import Loading from "../../components/loading";

export default function PublicRecipes() {
  const { publicRecipesData: data, publicRecipesError: error, publicRecipesIsLoading: loading } = getPublicRecipes();

  return (
    <>
      <h1>Public Recipes</h1>
      {loading ? <Loading /> : error ? <p>Error: {error.message}</p> : data && data.recipes ?
        <div className="grid grid-cols-1 gap-4">
          {data.recipes.map((el, i) => {
            return (
              <div key={`publicRecipe${i}`}>
                <RecipeCard recipe={el} forPublic={true} />
              </div>
            )
          })}
        </div> : <></>}
    </>
  )
}