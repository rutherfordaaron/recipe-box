import { useRouter } from "next/router";
import Loading from "../../../../components/loading";
import getRecipe from "../../../../util/getRecipe";

const RecipeDetails = () => {
  const router = useRouter();
  const id = router.query.id ? router.query.id.toString() : "";

  let { recipeData, recipeError, recipeIsLoading } = getRecipe(id);

  if (recipeIsLoading) return <Loading />
  if (recipeError) return <p>Something went wrong! {recipeError.message}</p>
  if (recipeData && !recipeData.recipe) return <p>Something went wrong! {recipeData.message}</p>
  if (recipeData && recipeData.recipe) {
    const recipe = recipeData.recipe;
    return (
      <article>
        <section>
          <h1>{recipe.name}</h1>
          <p>{!recipe.rating ? "" : recipe.rating}</p>
          <p>{recipe.description}</p>
          <div>
            <p>Prep Time: {!recipe.prepTime ? "unknown" : recipe.prepTime}</p>
            <p>Cook Time: {!recipe.cookTime ? "unknown" : recipe.cookTime}</p>
          </div>
          <p>Servings: {!recipe.servings ? "unknown" : recipe.servings}</p>
        </section>

        <section>
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients.map((el, i) => {
              return (
                <li key={`${recipe._id}Ingredient${i}`}>{el[0]} of {el[1]}</li>
              )
            })}
          </ul>
        </section>

        <section>
          <h2>Directions</h2>
          <ol>
            {recipe.directions.map((el, i) => {
              return (
                <li key={`${recipe._id}Direction${i}`}>{el}</li>
              )
            })}
          </ol>
        </section>
        <button type="button">Edit</button>
        <button type="button">Delete</button>
      </article>
    )
  }
}

export default RecipeDetails