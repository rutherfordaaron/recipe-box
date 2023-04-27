import getRecipes from "../../util/getRecipes";
import { Filter } from "../../util/types";
import { useRouter } from "next/router";
import RecipeCard from "./RecipeCard";

const RecipeGridPage = (props: { index: number, size: number, filter: Filter, setEndOfData: Function }) => {
  const { index, size, filter, setEndOfData } = props;
  const router = useRouter();
  const { data } = getRecipes(filter, { size: size, page: index }, /public/.test(router.pathname));
  return (
    <>
      {data && data.recipes ? data.recipes.map((el, i) => {
        if (data.matched <= (index + 1) * size) { setEndOfData(true) } else { setEndOfData(false) };
        return <RecipeCard recipe={el} key={`${index}recipe${i}`} />
      }) : <></>}
    </>
  )
}

export default RecipeGridPage;