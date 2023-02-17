import Input from "../input/input";
import { useState } from "react";
import Recipe, { RecipeType } from "../../models/recipe";
import RadioButton from "../radio-button/radioButton";
import NavButtons from "./NavButtons";

const PageOne = (props: { recipe: Record<string, any>, setRecipe: Function, setPage: Function }) => {
  // Form page 1
  const [name, setName] = useState(props.recipe.name ? props.recipe.name : "");
  const [nameValid, setNameValid] = useState(true);
  const [description, setDescription] = useState(props.recipe.description ? props.recipe.description : "");
  const [origin, setOrigin] = useState(props.recipe.origin ? props.recipe.origin : "");
  const [originValid, setOriginValid] = useState(true);
  const [recipeType, setRecipeType] = useState<RecipeType | string>(props.recipe.recipeType ? props.recipe.recipeType : "");

  const validatePage = () => {
    if (name && origin && recipeType) {
      const recipe: Record<string, any> = { ...props.recipe }
      recipe.name = name;
      recipe.description = description;
      recipe.origin = origin;
      recipe.recipeType = recipeType;
      props.setRecipe(recipe);
      return true
    } else {
      if (!recipeType) {
        const error = document.getElementById("error");
        if (error) {
          error.innerHTML = "Please select a recipe type"
        }
      }
      return false
    }
  }

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

  return (
    <>
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

      <NavButtons page={1} setState={props.setPage} validate={validatePage} />

    </>
  )
}

export default PageOne;