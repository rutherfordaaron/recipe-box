import getRecipes from "../../util/getRecipes";
import { Filter } from "../../util/types";
import { useRouter } from "next/router";
import RecipeCard from "./RecipeCard";

const RecipeGridPage = (props: { index: number, size: number, filter: Filter }) => {
  const { index, size, filter } = props;
  const router = useRouter();
  const { data } = getRecipes(filter, { size: size, page: index }, /public/.test(router.pathname));
  return (
    <>
      {data && data.recipes ? data.recipes.map((el, i) => {
        return (
          <div key={`${index}recipe${i}`}>
            <RecipeCard recipe={el} key={`${index}recipe${i}`} />
            <p>{`${index}recipe${i}`}</p>
          </div>)
      }) : <></>}
    </>
  )
}

export default RecipeGridPage;