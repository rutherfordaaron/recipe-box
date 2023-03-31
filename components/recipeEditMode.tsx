import { Recipe } from "../util/types";
import { useRouter } from "next/router";

const RecipeEditMode = (props: { recipe: Recipe, setEditMode: Function }) => {
  const router = useRouter();

  const updateRecipe = () => {
    router.push({ pathname: "/profile/my-recipe-box", query: { message: "Recipe updated", good: true } }, "/profile/my-recipe-box");
  }

  const cancelEdit = () => {
    props.setEditMode(false);
  }

  return (
    <>
      <h1>Editing recipe {props.recipe._id?.toString()}</h1>
      <button type="button" onClick={updateRecipe}>Save</button>
      <button type="button" onClick={cancelEdit}>Cancel</button>
    </>
  )
}

export default RecipeEditMode;