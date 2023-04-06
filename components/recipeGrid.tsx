import { Recipe } from "../util/types";
import { Spinner } from "./spinner";
import RecipeCard from "./RecipeCard";
import { useRouter } from "next/router";

export const RecipeGrid = (props: { recipes: Recipe[], isLoading: boolean }) => {
  const { recipes, isLoading } = props;
  const router = useRouter();

  const mapRecipeCards = (arr: Recipe[]) => {
    return arr.map((el, i) => {
      return (
        <RecipeCard
          recipe={el}
          key={el._id?.toString()}
          forPublic={router.pathname === "/public-recipes"}
        />
      )
    })
  }

  return (
    <div className="flex flex-col md:grid lg:grid-cols-2 justify-center items-center gap-4">
      {isLoading ? <Spinner /> : recipes ? mapRecipeCards(recipes) : <></>}
    </div>
  )
}