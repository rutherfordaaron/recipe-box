import { useRouter } from "next/router";
import { useState } from "react";
import Loading from "../../../../components/loading";
import getRecipe from "../../../../util/getRecipe";
import getUser from "../../../../util/getUser";
import RecipeEditMode from "../../../../components/recipeEditMode";
import { BackButton } from "../../../../components/backButton";

const RecipeDetails = () => {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [confrimDelete, setConfirmDelete] = useState(false);
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
        <BackButton href="/profile/my-recipe-box" />
        {!confrimDelete ? <></> :
          <div className="fixed inset-0 bg-translucent z-[5] flex flex-col justify-center items-center p-12 text-center">
            <p className="text-xl drop-shadow">Are you sure you want to delete this recipe? This <span className="italic">cannot</span> be undone.</p>
            <div className="flex gap-4 mt-4">
              <button className="bg-rose-100 text-rose-900 border-none hover:bg-rose-500 hover:text-black shadow-lg" onClick={deleteRecipe}>Yes, I'm sure</button>
              <button className="bg-emerald-100 text-emerald-900 hover:bg-emerald-500 hover:text-black border-none shadow-lg" onClick={e => setConfirmDelete(false)}>No, nevermind</button>
            </div>
          </div>}
        <section className="relative">
          <h1>{recipe.name}</h1>
          {recipe.rating ? <p className="absolute top-0 right-0 text-sm text-slate-400">{recipe.rating}/10</p> : <></>}
          {recipe.description ? <p className="mb-4">{recipe.description}</p> : <></>}
          <div>

            {recipe.prepTime ? <p>Prep Time: {recipe.prepTime}</p> : <></>}
            {recipe.cookTime ? <p>Cook Time: {recipe.cookTime}</p> : <></>}
          </div>
          {recipe.servings ? <p>Servings: {recipe.servings}</p> : <></>}
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
        <div className="flex justify-around items-center py-4">
          {recipeData.recipe.owner === userData?.user?.username ? <button className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none hover:bg-transparent text-slate-300 border-slate-200 py-0 hover:text-black hover:border-black transition-all" type="button" onClick={e => setEditMode(true)}>Edit</button> : <></>}
          {recipeData.recipe.owner === userData?.user?.username ? <button className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none hover:bg-transparent text-slate-300 border-slate-200 py-0 hover:text-rose-400 hover:border-rose-500 transition-all" type="button" onClick={e => setConfirmDelete(true)}>Delete</button> : <></>}
        </div>
        {error ? <p className="text-red-400 text-center py-5">{error}</p> : <></>}
      </article>
    )
  }
  if (editMode && recipeData && recipeData.recipe) {
    return <RecipeEditMode recipe={recipeData?.recipe} setEditMode={setEditMode} editMode={true} />
  }
}

export default RecipeDetails