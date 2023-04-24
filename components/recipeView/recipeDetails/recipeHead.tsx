import { Recipe } from "../../../util/types";
import { Rating } from "./rating";
import CommentPreview from "../../comments/commentPreview";
import { getCommentCount } from "../../../util/getCommentCount";
import getUser from "../../../util/getUser";

const RecipeHead = (props: { recipe: Recipe }) => {
  const { recipe } = props;
  const { userData } = getUser();

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
    <section className="relative">
      <div className="flex gap-6 justify-end">
        <CommentPreview count={!recipe.comments ? 0 : getCommentCount(recipe.comments)} />
        <Rating ratings={recipe.ratings ? recipe.ratings : []} />
      </div>
      <h1 className="mb-0">{recipe.name}</h1>
      <p className="text-sm text-gray-500">Owned by {userData && userData.user && userData.user.username === recipe.owner ? "you" : recipe.owner}</p>
      <p className="text-gray-300 text-xs">{recipe.recipeType} from {recipe.origin}</p>
      {recipe.description ? <p className="my-4">{recipe.description}</p> : <></>}
      <div className="flex flex-col text-sm text-gray-400">
        {recipe.servings ? <p>Servings: {recipe.servings}</p> : <></>}
        {recipe.prepTime ? <p>Prep Time: {recipe.prepTime >= 60 ? `${Math.floor(recipe.prepTime / 60)} hrs. ${recipe.prepTime % 60} min.` : `${recipe.prepTime} min.`}</p> : <></>}
        {recipe.cookTime ? <p>Cook Time: {recipe.cookTime >= 60 ? `${Math.floor(recipe.cookTime / 60)} hrs. ${recipe.cookTime % 60} min.` : `${recipe.cookTime} min.`}</p> : <></>}
      </div>
      <div className="text-sm w-full text-sky-400 flex gap-2 flex-wrap">
        {getTags()}
      </div>
    </section>
  )
}

export default RecipeHead;