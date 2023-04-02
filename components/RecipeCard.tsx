import { ObjectId } from "mongodb"
import Link from "next/link";
import { Recipe } from "../util/types";

const RecipeCard = (props: { recipe: Recipe }) => {
  const recipe = props.recipe;
  let rating: undefined | number = undefined;
  if (recipe.rating) {
    let sum = 0
    recipe.rating.map((el, i) => {
      sum += el;
    });
    rating = sum / recipe.rating.length;
  }

  return (
    <Link href={`/profile/my-recipe-box/recipe/${String(recipe._id)}`} className="rounded-md p-3 block bg-sky-100 hover:bg-sky-200 relative w-full shadow-md">
      <h2>{recipe.name}</h2>
      <p className="line-clamp-4 h-24">{recipe.description}</p>
      <p className="my-3">{recipe.recipeType} from {recipe.origin}</p>
      <div className="flex justify-between h-[20px]">
        {recipe.prepTime ? <p className="text-sm"><span className="font-bold">Prep Time:</span> {recipe.prepTime} min.</p> : ""}
        {recipe.cookTime ? <p className="text-sm"><span className="font-bold">Cook Time:</span> {recipe.cookTime} min.</p> : ""}
      </div>
      <p className="absolute top-2 right-2 text-sm">{rating ? rating + "/10" : ""}</p>
    </Link>
  )
}

export default RecipeCard