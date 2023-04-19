import { useRouter } from "next/router";
import Loading from "../../components/loading";
import getRecipe from "../../util/getRecipe";
import getUser from "../../util/getUser";
import { BackButton } from "../../components/backButton";
import { Rating } from "../../components/rating";
import { useState } from "react";
import MessageBanner from "../../components/layout/messageBanner";
import RatingInput from "../../components/ratingInput";
import Comments from "../../components/comments";

const PublicRecipeDetails = () => {
  const [showRatingInput, setShowRatingInput] = useState(false);
  const [error, setError] = useState("")
  const [ok, setOk] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const router = useRouter();
  const id = router.query.id ? router.query.id.toString() : "";

  let { recipeData, recipeError, recipeIsLoading } = getRecipe(id);
  let { userData, userError, userIsLoading } = getUser();

  if (recipeIsLoading || userIsLoading) return <Loading />
  if (recipeError) return <p>Something went wrong! {recipeError.message}</p>
  if (userError) return <p>Soemthing went wrong! {userError.message}</p>
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

    const rateRecipe = () => {
      if (!(userData && userData.user)) {
        setOk(false);
        setError("Please log in to rate recipes")
      } else if (userData.user.username === recipe.owner) {
        setError("You cannot rate your own recipe from here")
        setOk(false);
      } else {
        setShowRatingInput(true);
      }
    }

    const addRating = () => {
      setShowRatingInput(false);
      if (!(userData && userData.user)) {
        setError("Please log in to rate recipes");
        setOk(false);
      } else {
        fetch("/api/addRating", { method: "POST", headers: { "recipe-id": String(recipe._id), "new-rating": newRating.toString(), "user": userData?.user?.username } })
          .then(res => res.json())
          .then(data => {
            if (!data.success) {
              setError(data.message);
              setOk(false);
            } else {
              setError(data.message)
              setOk(true)
            }
          })
      }
    }

    return (
      <article>
        <BackButton href="/public-recipes" />

        <section className="relative">
          <Rating ratings={recipe.ratings ? recipe.ratings : []} />
          <h1>{recipe.name}</h1>
          <p>{recipe.recipeType} from {recipe.origin}</p>
          <p>Owned by {recipe.owner}</p>
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

        {showRatingInput ?
          <div>
            <RatingInput rating={newRating} setRating={setNewRating} />
            <button className="block mx-auto bg-sky-200 shadow-lg py-2 px-4 hover:bg-sky-400 transition-all mt-6" type="button" onClick={addRating}>Confrim</button>
          </div> :
          <button className="block mx-auto bg-sky-200 shadow-lg py-2 px-4 hover:bg-sky-400 transition-all mt-6" type="button" onClick={rateRecipe}>Rate this recipe</button>
        }
        <Comments comments={recipe.comments ? recipe.comments : []} />
        <MessageBanner message={error} ok={ok} />
      </article>
    )
  }
}

export default PublicRecipeDetails