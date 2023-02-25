import NavButtons from "./NavButtons"
import Input from "../input/input"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGripLines, faXmark } from "@fortawesome/free-solid-svg-icons"

const PageTwo = (props: { recipe: Record<string, any>, setRecipe: Function, setPage: Function }) => {
  // State variables
  const [newIngredient, setNewIngredient] = useState("");
  const [newMeasurement, setNewMeasurement] = useState("")
  const [ingredientArr, setIngredientArr] = useState<string[][]>(props.recipe.ingredients ? [...props.recipe.ingredients] : []);

  /**Add ingredients to the ingredientArr variable.
   * ingredientArr is of type String[][]
   * Nested array first element is measurment, second element is ingredient name.
   * This is to set up the ability to create grocery lists. I figured separating names from measurements now would make that easier.
   * Clear the newIngredient and newMeasurement state variable after pushing new ingredient to ingredientArr
   */
  const addIngredient = () => {
    const error = document.getElementById("error");
    if (newIngredient && newMeasurement) {
      const ingredient = [newMeasurement, newIngredient];
      const tempIngredientArr = [...ingredientArr];
      tempIngredientArr.push(ingredient);
      setIngredientArr(tempIngredientArr);
      setNewIngredient("");
      setNewMeasurement("");
      if (error) {
        error.innerHTML = "";
      }
    } else {
      if (error) error.innerHTML = "Please make sure you have an ingredient and a measurement."
    }
  }

  /**Remove and item from the ingredientArr by using .filter() */
  const removeItem = (item: String[]) => {
    const tempIngredientArr = [...ingredientArr];
    const newArr = tempIngredientArr.filter(el => el != item);
    setIngredientArr(newArr);
  }

  /**Set the ingredient list to the recipe object before moving to the next page.
   * Also, make sure that there is at least one ingredient in the array before allowing to move to the next page.
   */
  const validatePage = () => {
    const recipe: Record<string, any> = { ...props.recipe }
    recipe.ingredients = ingredientArr;
    props.setRecipe(recipe);
    if (ingredientArr[0]) {
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

        <div>
          {/* Map over the ingredients list to render a visually editable list */}
          {ingredientArr.map((el, i) => {
            return (
              <div className="flex justify-between gap-3 my-3">
                <div className="flex gap-3 items-center">
                  <FontAwesomeIcon
                    icon={faGripLines}
                    className="hover:cursor-move"
                  />
                  <p key={`ingredient${i}`}>{el[0]} of {el[1]}</p>
                </div>
                <FontAwesomeIcon
                  icon={faXmark}
                  className="hover:cursor-pointer"
                  onClick={() => removeItem(el)}
                />
              </div>
            )
          })}
        </div>
      </div>

      <p id="error" className="text-sm font-bold text-center text-red-400 my-3"></p>

      <NavButtons page={2} setState={props.setPage} validate={validatePage} />
    </>
  )
}

export default PageTwo