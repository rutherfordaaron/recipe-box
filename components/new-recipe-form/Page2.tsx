import NavButtons from "./NavButtons"
import Input from "../input/input"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGripLines, faXmark } from "@fortawesome/free-solid-svg-icons"
import styles from "../../public/styles/profile/new-recipe-form.module.scss";

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
    const ingredient = [newMeasurement, newIngredient];
    const tempIngredientArr = [...ingredientArr];
    tempIngredientArr.push(ingredient);
    setIngredientArr(tempIngredientArr);
    setNewIngredient("");
    setNewMeasurement("");
    const error = document.getElementById("error");
    if (error) {
      error.innerHTML = "";
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
          onChange={e => setNewMeasurement(e.target.value)}
        />
        <Input
          id="ingredientInput"
          type="text"
          label="New Ingredient"
          state={newIngredient}
          valid={true}
          onChange={e => setNewIngredient(e.target.value)}
        />

        <button type="button" onClick={addIngredient}>
          Add Ingredient
        </button>

        <div className={styles.ingredientsContainer}>
          {/* Map over the ingredients list to render a visually editable list */}
          {ingredientArr.map((el, i) => {
            return (
              <div className={styles.ingredientWrapper}>
                <div className={styles.ingredientNameAndGripLines}>
                  <FontAwesomeIcon
                    icon={faGripLines}
                    className={styles.gripLines}
                  />
                  <p key={`ingredient${i}`} className={styles.ingredientName}>{el[0]} of {el[1]}</p>
                </div>
                <FontAwesomeIcon
                  icon={faXmark}
                  className={styles.xmark}
                  onClick={() => removeItem(el)}
                />
              </div>
            )
          })}
        </div>
      </div>

      <p id="error" className="warning"></p>

      <NavButtons page={2} setState={props.setPage} validate={validatePage} />
    </>
  )
}

export default PageTwo