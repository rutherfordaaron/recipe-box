import { useRouter } from "next/router";
import { useState } from "react";
import Loading from "../../../../components/loading";
import getRecipe from "../../../../util/getRecipe";
import getUser from "../../../../util/getUser";
import RecipeEditMode from "../../../../components/recipeEditMode";

const RecipeDetails = () => {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const router = useRouter();
  const id = router.query.id ? router.query.id.toString() : "";

  let { recipeData, recipeError, recipeIsLoading } = getRecipe(id);
  let { userData, userError, userIsLoading } = getUser();

  const deleteRecipe = async () => {
    setLoading(true);
    let response = await fetch(`/api/recipe?id=${id}`, { method: "DELETE" })
    let data = await response.json();
    if (data.error) {
      setError(data.message);
      setLoading(false);
    } else {
      // router.push("/profile/my-recipe-box", { query: { message: "Recipe successfully deleted" } })
      router.push({
        pathname: "/profile/my-recipe-box",
        query: { message: "Recipe successfully deleted", good: true }
      }, "/profile/my-recipe-box")
    }
  }

  if (recipeIsLoading || userIsLoading || loading) return <Loading />
  if (recipeError) return <p>Something went wrong! {recipeError.message}</p>
  if (userError) return <p>Something went wrong! {userError.message}</p>
  if (recipeData && !recipeData.recipe) return <p>Something went wrong! {recipeData.message}</p>
  if (recipeData && recipeData.recipe && !editMode) {
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
                <li key={`${recipe._id}Ingredient${i}`}>{el.measurement} of {el.ingredient}</li>
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
        {recipeData.recipe.owner === userData?.user?.username ? <button type="button" onClick={e => setEditMode(true)}>Edit</button> : <></>}
        {recipeData.recipe.owner === userData?.user?.username ? <button type="button" onClick={deleteRecipe}>Delete</button> : <></>}
        {error ? <p className="text-red-400 text-center py-5">{error}</p> : <></>}
      </article>
    )
  }
  if (editMode && recipeData && recipeData.recipe) {
    return <RecipeEditMode recipe={recipeData?.recipe} setEditMode={setEditMode} />
  }
}

export default RecipeDetails