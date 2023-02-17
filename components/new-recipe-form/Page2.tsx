import NavButtons from "./NavButtons"
import Input from "../input/input"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGripLines, faXmark } from "@fortawesome/free-solid-svg-icons"
import styles from "../../public/styles/profile/new-recipe-form.module.scss";

const PageTwo = (props: { recipe: object, setRecipe: Function, setPage: Function }) => {
  const [newIngredient, setNewIngredient] = useState("");
  const [newMeasurement, setNewMeasurement] = useState("")
  const [ingredientArr, setIngredientArr] = useState<string[][]>([]);

  const addIngredient = () => {
    const ingredient = [newMeasurement, newIngredient];
    const tempIngredientArr = [...ingredientArr];
    tempIngredientArr.push(ingredient);
    setIngredientArr(tempIngredientArr);
    setNewIngredient("");
    setNewMeasurement("");
  }

  const removeItem = (item: String[]) => {
    const tempIngredientArr = [...ingredientArr];
    const newArr = tempIngredientArr.filter(el => el != item);
    setIngredientArr(newArr);
  }

  const validatePage = () => {

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

      <NavButtons page={2} setState={props.setPage} validate={validatePage} />
    </>
  )
}

export default PageTwo