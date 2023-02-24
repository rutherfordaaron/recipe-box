import { ObjectId } from "mongodb"
import Link from "next/link";

const RecipeCard = (props: { id: ObjectId, name: string, description: string, recipeType: string, origin: string, prepTime: number | undefined, cookTime: number | undefined, rating: number[] | undefined }) => {
  let rating: undefined | number = undefined;
  if (props.rating) {
    let sum = 0
    props.rating.map((el, i) => {
      sum += el;
    });
    rating = sum / props.rating.length;
  }

  return (
    <Link href={`/profile/my-recipe-box/recipe/${String(props.id)}`} className="border rounded-md p-3 block bg-sky-100 hover:bg-sky-200 relative w-full shadow-md">
      <h2>{props.name}</h2>
      <p className="line-clamp-4 h-24">{props.description}</p>
      <p className="my-3">{props.recipeType} from {props.origin}</p>
      <div className="flex justify-between h-[20px]">
        {props.prepTime ? <p className="text-sm"><span className="font-bold">Prep Time:</span> {props.prepTime} min.</p> : ""}
        {props.cookTime ? <p className="text-sm"><span className="font-bold">Cook Time:</span> {props.prepTime} min.</p> : ""}
      </div>
      <p className="absolute top-2 right-2 text-sm">{rating ? rating + "/10" : ""}</p>
    </Link>
  )
}

export default RecipeCard