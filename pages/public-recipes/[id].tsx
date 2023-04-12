import { useRouter } from "next/router";
import Loading from "../../components/loading";
import getRecipe from "../../util/getRecipe";
import { BackButton } from "../../components/backButton";

const PublicRecipeDetails = () => {
  const router = useRouter();
  const id = router.query.id ? router.query.id.toString() : "";

  let { recipeData, recipeError, recipeIsLoading } = getRecipe(id);

  if (recipeIsLoading) return <Loading />
  if (recipeError) return <p>Something went wrong! {recipeError.message}</p>
  if (recipeData && !recipeData.recipe) return <p>Something went wrong! {recipeData.message}</p>
  if (recipeData && recipeData.recipe) {
    const recipe = recipeData.recipe;

    const getTags = () => {
      if (recipe.tags) {
        return (
          recipe.tags.map((el, i) => {
            return (
              <div key={`${recipe._id}tag${i}`} className="whitespace-nowrap">
                <p>#{el}</p>
              </div>
            )
          })
        )
      }
      return <></>
    }

    return (
      <article>
        <BackButton href="/public-recipes" />
        <section className="relative">
          <h1>{recipe.name}</h1>
          <p>{recipe.recipeType} from {recipe.origin}</p>
          <p>Owned by {recipe.owner}</p>
          {recipe.rating ? <p className="absolute -top-8 right-0 text-sm text-slate-400">{recipe.rating}/10</p> : <></>}
          {recipe.description ? <p className="mb-4">{recipe.description}</p> : <></>}
          <div className="flex flex-col text-sm text-gray-400">
            {recipe.servings ? <p>Servings: {recipe.servings}</p> : <></>}
            {recipe.prepTime ? <p>Prep Time: {recipe.prepTime >= 60 ? `${Math.floor(recipe.prepTime / 60)} hrs. ${recipe.prepTime % 60} min.` : `${recipe.prepTime} min.`}</p> : <></>}
            {recipe.cookTime ? <p>Cook Time: {recipe.cookTime >= 60 ? `${Math.floor(recipe.cookTime / 60)} hrs. ${recipe.cookTime % 60} min.` : `${recipe.cookTime} min.`}</p> : <></>}
          </div>
          <div className="text-sm w-full text-sky-400 flex gap-2 flex-wrap">
            {getTags()}
          </div>
        </section>

        <section>
          <h2 className="border-b-2 border-sky-900">Ingredients</h2>
          <ul>
            {recipe.ingredients.map((el, i) => {
              return (
                <li key={`${recipe._id}Ingredient${i}`}>{el.measurement} {/[a-zA-Z]/.test(el.measurement) ? "of " : ""}{el.ingredient}</li>
              )
            })}
          </ul>
        </section>

        <section>
          <h2 className="border-b-2 border-sky-900">Directions</h2>
          <ol className="flex flex-col gap-3">
            {recipe.directions.map((el, i) => {
              return (
                <li key={`${recipe._id}Direction${i}`}>{el}</li>
              )
            })}
          </ol>
        </section>
      </article>
    )
  }
}

export default PublicRecipeDetails