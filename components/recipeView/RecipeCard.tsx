import Link from "next/link";
import { Recipe } from "../../util/types";
import { Rating } from "./recipeDetails/rating";
import { getCommentCount } from "../../util/getCommentCount";
import CommentPreview from "../comments/commentPreview";

const RecipeCard = (props: { recipe: Recipe, forPublic?: boolean }) => {
  const recipe = props.recipe;
  const created = new Date(props.recipe.created);
  const updated = recipe.updated ? new Date(recipe.updated) : undefined;

  const getTags = () => {
    let tags = "";
    if (recipe.tags) {
      recipe.tags.map((el, i) => {
        tags += `#${el}  `
      })
    }
    return tags
  }

  const getCookTime = () => {
    let cookTime = 0;
    if (recipe.cookTime) cookTime += recipe.cookTime;
    if (recipe.prepTime) cookTime += recipe.prepTime;
    return cookTime;
  }

  return (
    <Link
      href={!props.forPublic ? `/profile/my-recipe-box/recipe/${String(recipe._id)}` : `/public-recipes/${String(recipe._id)}`}
      className="rounded-md p-3 block bg-sky-100 hover:bg-sky-200 relative w-full shadow-md transition-all"
    >
      <div className="flex justify-between items-center">
        <CommentPreview count={getCommentCount(recipe.comments ? recipe.comments : [])} />
        <Rating ratings={recipe.ratings ? recipe.ratings : []} />
      </div>
      <h2 className="my-0 line-clamp-1">{recipe.name}</h2>
      <p className="line-clamp-4 h-24 text-sky-700 mb-4">{recipe.description}</p>
      <p className="text-sm text-sky-500 line-clamp-1 font-bold">{getTags()}</p>

      <div className="flex justify-between h-[20px] text-sky-400">
        {getCookTime() ? <p className="text-sm">Total time: {getCookTime() >= 60 ? `${Math.floor(getCookTime() / 60)} hrs. ${getCookTime() % 60} min.` : `${getCookTime()} min.`}</p> : <></>}
      </div>

      <div className="text-xs text-sky-300 grid grid-cols-2">
        <p>Created: {created.getMonth()}/{created.getDate()}/{created.getFullYear()}</p>
        {updated ? <p className="text-right">Updated: {updated.getMonth()}/{updated.getDate()}/{updated.getFullYear()}</p> : <p></p>}
        <p className="line-clamp-1">{recipe.recipeType} from {recipe.origin}</p>
        {props.forPublic ?
          <Link href={`/profile/public/${recipe.owner}`} className="text-right underline italic">Owner: {recipe.owner}</Link> :
          <p className="text-right">{recipe.public ? "Public" : "Private"} Recipe</p>
        }
      </div>
    </Link>
  )
}

export default RecipeCard