import NavButtons from "./NavButtons"
import Input from "../input/input"
import { useState } from "react"
import { uuid } from "uuidv4"
import EditableList from "../editableList"
import { Ingredient } from "../editableList"

const PageTwo = (props: { recipe: Record<string, any>, setRecipe: Function, setPage: Function }) => {
  // State variables
  const [newIngredient, setNewIngredient] = useState("");
  const [newMeasurement, setNewMeasurement] = useState("")
  const [ingredients, setIngredients] = useState<Ingredient[]>(props.recipe.ingredients ? [...props.recipe.ingredients] : []);

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

  /**Set the ingredient list to the recipe object before moving to the next page.
   * Also, make sure that there is at least one ingredient in the array before allowing to move to the next page.
   */
  const validatePage = () => {
    const recipe: Record<string, any> = { ...props.recipe }
    recipe.ingredients = ingredients;
    props.setRecipe(recipe);
    if (ingredients[0]) {
      return true;
    } else {
      const error = document.getElementById("error");
      if (error) {
        error.innerHTML = "You must have at least one ingredient"
      }
    }
  }

  return (
    <>
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

      <p id="error" className="text-sm font-bold text-center text-red-400 my-3"></p>

      <NavButtons page={2} setState={props.setPage} validate={validatePage} />
    </>
  )
}

export default PageTwo