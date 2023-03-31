import { Recipe, RecipeType, Ingredient } from "../util/types";
import { useRouter } from "next/router";
import Input from "./input";
import RadioButton from "./radioButton";
import EditableList from "./editableList";
import { useState } from "react";
import { uuid } from "uuidv4";

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
  // -------------------- INGREDIENTS STATE VARIABLES --------------------
  const [newIngredient, setNewIngredient] = useState("");
  const [newMeasurement, setNewMeasurement] = useState("")
  const [ingredients, setIngredients] = useState<Ingredient[]>(props.recipe.ingredients ? [...props.recipe.ingredients] : []);
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

  // -------------------- INGREDIENT EVENT HANDLERS --------------------
  /**Add ingredients to the ingredientArr variable.
   * ingredientArr is of type { ingredient: string, measurement: string, id: string }
   * This is to set up the ability to create grocery lists. I figured separating names from measurements now would make that easier.
   * Clear the newIngredient and newMeasurement state variable after pushing new ingredient to ingredientArr
   */
  const addIngredient = () => {
    const error = document.getElementById("error");
    if (newIngredient && newMeasurement) {
      const ingredient = {
        measurement: newMeasurement,
        ingredient: newIngredient,
        id: uuid()
      };
      const tempIngredientArr = [...ingredients];
      tempIngredientArr.push(ingredient);
      setIngredients(tempIngredientArr);
      setNewIngredient("");
      setNewMeasurement("");
      if (error) error.innerHTML = "";
    } else {
      if (error) error.innerHTML = "Please make sure you have an ingredient and a measurement."
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

        {/* -------------------- BASIC INFO SECTION ------------------- */}
        <h2>Ingredients</h2>
        <div>
          <Input
            id="measurementInput"
            type="text"
            label="Measurement"
            state={newMeasurement}
            valid={true}
            onChange={e => {
              const regex = /[0-9a-zA-Z]/
              if (regex.test(e.target.value) || e.target.value === "") {
                setNewMeasurement(e.target.value)
              } else {
                const warning = document.getElementById("error");
                if (warning) warning.innerHTML = "A measurement must conatiner letters or numbers."
              }
            }}
          />
          <Input
            id="ingredientInput"
            type="text"
            label="New Ingredient"
            state={newIngredient}
            valid={true}
            onChange={e => {
              const regex = /[a-zA-Z]/
              if (regex.test(e.target.value) || e.target.value === "") {
                setNewIngredient(e.target.value)
              } else {
                const warning = document.getElementById("error");
                if (warning) warning.innerHTML = "An ingredient must conatiner letters."
              }
            }}
          />

          <button type="button" onClick={addIngredient}>
            Add Ingredient
          </button>

          <EditableList list={ingredients} setList={setIngredients} />
        </div>


        <p id="error" className="warning"></p>
        <button type="button" onClick={updateRecipe}>Save</button>
        <button type="button" onClick={cancelEdit}>Cancel</button>
      </form>
    </>
  )
}

export default RecipeEditMode;