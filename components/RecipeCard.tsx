import { useState } from "react";
import Link from "next/link";
import { Recipe } from "../util/types";

const RecipeCard = (props: { recipe: Recipe, forPublic?: boolean }) => {
  const recipe = props.recipe;
  const created = new Date(props.recipe.created);
  const updated = recipe.updated ? new Date(recipe.updated) : undefined;

  let rating: undefined | number = undefined;
  if (recipe.rating) {
    let sum = 0
    for (let i = 0; i < recipe.rating.length; i++) {
      sum += recipe.rating[i]
    }
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
      <h2 className="mb-0">{recipe.name}</h2>
      <p className="line-clamp-4 h-24 text-sky-700 mb-4">{recipe.description}</p>
      <div className="text-sm w-full text-sky-500 overflow-x-scroll flex h-6 pb-2 gap-2 font-bold">
        {getTags()}
      </div>
      <div className="flex justify-between h-[20px] text-sky-400">
        {getCookTime() ? <p className="text-sm">Total time: {getCookTime() >= 60 ? `${Math.floor(getCookTime() / 60)} hrs. ${getCookTime() % 60} min.` : `${getCookTime()} min.`}</p> : <></>}
      </div>

      <div className="text-xs text-sky-300 grid grid-cols-2">
        <p>Created: {created.getMonth()}/{created.getDate()}/{created.getFullYear()}</p>
        {updated ? <p className="text-right">Updated: {updated.getMonth()}/{updated.getDate()}/{updated.getFullYear()}</p> : <p></p>}
        <p className="line-clamp-1">{recipe.recipeType} from {recipe.origin}</p>
        {props.forPublic ? <p className="text-right">Owner: {recipe.owner}</p> : <p className="text-right">{recipe.public ? "Public" : "Private"} Recipe</p>}
      </div>
      <p className="absolute top-2 right-2 text-sm">{rating ? rating + "/10" : ""}</p>
    </Link>
  )
}

export default RecipeCard