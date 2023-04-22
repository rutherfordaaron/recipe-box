import { useRouter } from "next/router";
import { useState } from "react";
import Loading from "../../../../components/loading";
import getRecipe from "../../../../util/getRecipe";
import getUser from "../../../../util/getUser";
import RecipeEditMode from "../../../../components/recipeView/recipeDetails/recipeEditMode";
import { BackButton } from "../../../../components/recipeView/recipeDetails/backButton";
import { DestructiveAction } from "../../../../components/layout/destructiveAction";
import RecipeHead from "../../../../components/recipeView/recipeDetails/recipeHead";
import IngredientsAndDirections from "../../../../components/recipeView/recipeDetails/ingredientsAndDirections";
import Comments from "../../../../components/comments/comments";

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
        <RecipeHead recipe={recipe} />
        <IngredientsAndDirections recipe={recipe} />

        <div className="flex justify-around items-center py-4">
          {recipeData.recipe.owner === userData?.user?.username ?
            <button
              className="update-recipe-button"
              type="button"
              onClick={e => setEditMode(true)}
            >
              Edit
            </button> : <></>}
          {recipeData.recipe.owner === userData?.user?.username ?
            <button
              className="delete-recipe-button"
              type="button"
              onClick={e => setConfirmDelete(true)}
            >
              Delete
            </button> : <></>}
        </div>

        <DestructiveAction
          message="Are you sure you want to delete this recipe?"
          destroyMessage="Yes, I'm sure"
          cancelMessage="No, nevermind"
          setVisible={setConfirmDelete}
          destructiveAction={deleteRecipe}
          visible={confrimDelete}
        />

        {error ? <p className="text-red-400 text-center py-5">{error}</p> : <></>}

        <Comments comments={recipe.comments ? recipe.comments : []} recipeId={id} />
      </article>
    )
  }
  if (editMode && recipeData && recipeData.recipe) {
    return <RecipeEditMode recipe={recipeData?.recipe} setEditMode={setEditMode} editMode={true} user={userData && userData.user ? userData.user : undefined} />
  }
}

export default RecipeDetails