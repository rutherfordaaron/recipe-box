import { Recipe } from "../util/types";

const RecipeEditMode = (props: { recipe: Recipe, setEditMode: Function }) => {
  return (
    <>
      <h1>Editing recipe {props.recipe._id?.toString()}</h1>
      <button type="button" onClick={e => props.setEditMode(false)}>Save</button>
    </>
  )
}

export default RecipeEditMode;