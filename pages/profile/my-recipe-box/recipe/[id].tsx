import { useRouter } from "next/router";
import { useState } from "react";
import Loading from "../../../../components/loading";
import getRecipe from "../../../../util/getRecipe";
import getUser from "../../../../util/getUser";
import RecipeEditMode from "../../../../components/recipeEditMode";
import { BackButton } from "../../../../components/recipeView/backButton";
import { DestructiveAction } from "../../../../components/destructiveAction";
import { Rating } from "../../../../components/rating";

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
        <BackButton href="/profile/my-recipe-box" />
        <DestructiveAction message="Are you sure you want to delete this recipe?" destroyMessage="Yes, I'm sure" cancelMessage="No, nevermind" setVisible={setConfirmDelete} destructiveAction={deleteRecipe} visible={confrimDelete} />

        <section className="relative">
          <Rating ratings={recipe.ratings ? recipe.ratings : []} />
          <h1>{recipe.name}</h1>
          <p>{recipe.recipeType} from {recipe.origin}</p>
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
        <div className="flex justify-around items-center py-4">
          {recipeData.recipe.owner === userData?.user?.username ? <button className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none hover:bg-transparent text-slate-300 border-slate-200 py-0 hover:text-black hover:border-black transition-all shadow-none" type="button" onClick={e => setEditMode(true)}>Edit</button> : <></>}
          {recipeData.recipe.owner === userData?.user?.username ? <button className="border-b-2 border-t-0 border-l-0 border-r-0 rounded-none hover:bg-transparent text-slate-300 border-slate-200 py-0 hover:text-rose-400 hover:border-rose-500 transition-all shadow-none" type="button" onClick={e => setConfirmDelete(true)}>Delete</button> : <></>}
        </div>
        {error ? <p className="text-red-400 text-center py-5">{error}</p> : <></>}
      </article>
    )
  }
  if (editMode && recipeData && recipeData.recipe) {
    return <RecipeEditMode recipe={recipeData?.recipe} setEditMode={setEditMode} editMode={true} user={userData && userData.user ? userData.user : undefined} />
  }
}

export default RecipeDetails