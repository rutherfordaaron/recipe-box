import { Recipe, RecipeType } from "../util/types";
import { useRouter } from "next/router";
import Input from "./input";
import RadioButton from "./radioButton";
import { useState } from "react";

const RecipeEditMode = (props: { recipe: Recipe, setEditMode: Function }) => {
  const { recipe, setEditMode } = props;
  const router = useRouter();

  // -------------------- BASIC INFO STATE VARIABLES --------------------
  const [name, setName] = useState(recipe.name ? recipe.name : "");
  const [nameValid, setNameValid] = useState(true);
  const [description, setDescription] = useState(recipe.description ? recipe.description : "");
  const [origin, setOrigin] = useState(recipe.origin ? recipe.origin : "");
  const [originValid, setOriginValid] = useState(true);
  const [recipeType, setRecipeType] = useState<RecipeType | string>(recipe.recipeType ? recipe.recipeType : "");

  // -------------------- BASIC INFO EVENT HANDLERS --------------------
  const nameChangeHandler = (value: string) => {
    setName(value);
    if (!value) {
      setNameValid(false);
    } else {
      setNameValid(true);
    }
  }

  const descriptionChangeHandler = (value: string) => {
    setDescription(value);
  }

  const originChangeHandler = (value: string) => {
    setOrigin(value);
    if (!value) {
      setOriginValid(false);
    } else {
      setOriginValid(true);
    }
  }

  const updateRecipe = () => {
    router.push({ pathname: "/profile/my-recipe-box", query: { message: "Recipe updated", good: true } }, "/profile/my-recipe-box");
  }

  const cancelEdit = () => {
    setEditMode(false);
  }

  return (
    <>
      <h1>Edit Mode</h1>
      <form>
        {/* -------------------- BASIC INFO SECTION ------------------- */}
        <h2>Basic Info</h2>
        <Input
          id="name"
          type="text"
          label="Name*"
          onChange={e => { nameChangeHandler(e.target.value); }}
          state={name}
          valid={nameValid}
        />

        <Input
          id="description"
          type="text"
          label="Description"
          onChange={e => { descriptionChangeHandler(e.target.value) }}
          state={description}
          valid={true}
        />

        <Input
          id="origin"
          type="text"
          label="Origin*"
          onChange={e => { originChangeHandler(e.target.value) }}
          state={origin}
          valid={originValid}
        />

        <div>
          <label htmlFor="recipeType">Recipe Type*</label>
          <RadioButton
            id="modified"
            label="Modified"
            name="recipeType"
            onClick={e => setRecipeType(RecipeType.Modified)}
            checked={recipeType === RecipeType.Modified ? true : false}
          />
          <RadioButton
            id="copied"
            label="Copied"
            name="recipeType"
            onClick={e => setRecipeType(RecipeType.Copied)}
            checked={recipeType === RecipeType.Copied ? true : false}
          />
          <RadioButton
            id="original"
            label="Original"
            name="recipeType"
            onClick={e => setRecipeType(RecipeType.Original)}
            checked={recipeType === RecipeType.Original ? true : false}
          />
        </div>

        <p id="error" className="warning"></p>
        <button type="button" onClick={updateRecipe}>Save</button>
        <button type="button" onClick={cancelEdit}>Cancel</button>
      </form>
    </>
  )
}

export default RecipeEditMode;