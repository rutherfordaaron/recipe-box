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
    <div className="flex flex-col md:grid lg:grid-cols-2 items-center gap-4 max-h-[73vh] md:max-h-[75vh] py-4 pr-2 overflow-y-scroll">
      {isLoading ? <Spinner /> : recipes ? mapRecipeCards(recipes) : <></>}
    </div>
  )
}