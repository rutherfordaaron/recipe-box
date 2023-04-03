import { useState } from "react";
import Link from "next/link";
import { Recipe } from "../util/types";

const RecipeCard = (props: { recipe: Recipe }) => {
  const [tagsVisible, setTagsVisible] = useState(false);
  const recipe = props.recipe;
  let rating: undefined | number = undefined;
  if (recipe.rating) {
    let sum = 0
    recipe.rating.map((el, i) => {
      sum += el;
    });
    rating = sum / recipe.rating.length;
  }

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
    <Link href={`/profile/my-recipe-box/recipe/${String(recipe._id)}`} className="rounded-md p-3 block bg-sky-100 hover:bg-sky-200 relative w-full shadow-md">
      <h2>{recipe.name}</h2>
      <p className="line-clamp-4 h-24">{recipe.description}</p>
      <p className="my-3">{recipe.recipeType} from {recipe.origin}</p>
      <div className="flex justify-between h-[20px]">
        {recipe.prepTime ? <p className="text-sm"><span className="font-bold">Prep Time:</span> {recipe.prepTime} min.</p> : ""}
        {recipe.cookTime ? <p className="text-sm"><span className="font-bold">Cook Time:</span> {recipe.cookTime} min.</p> : ""}
        <div className="text-sm w-full text-sky-400 overflow-x-scroll flex h-6 pb-2 gap-2">
          {getTags()}
        </div>
      </div>
      <p className="absolute top-2 right-2 text-sm">{rating ? rating + "/10" : ""}</p>
    </Link>
  )
}

export default RecipeCard