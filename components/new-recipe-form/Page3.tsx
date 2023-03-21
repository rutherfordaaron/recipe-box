import NavButtons from "./NavButtons"
import Input from "../input/input"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGripLines, faXmark } from "@fortawesome/free-solid-svg-icons"
import EditableList from "../editableList"

const PageThree = (props: { recipe: Record<string, any>, setRecipe: Function, setPage: Function }) => {
  // State variables
  const [newDirection, setNewDirection] = useState("");
  const [directionArr, setDirecitonArr] = useState<string[]>(props.recipe.directions ? [...props.recipe.directions] : []);

  /**Add directions to the directionArr variable.
   * Clear the newDirection state variable after pushing new ingredient to directionArr
   */
  const addDirection = () => {
    if (newDirection) {
      const tempDirectionArr = [...directionArr];
      tempDirectionArr.push(newDirection);
      setDirecitonArr(tempDirectionArr);
      setNewDirection("");
      const error = document.getElementById("error");
      if (error) {
        error.innerHTML = "";
      }
    } else {
      const error = document.getElementById("error");
      if (error) {
        error.innerHTML = "Please type in a direction.";
      }
    }
  }

  /**Set the directions list to the recipe object before moving to the next page.
   * Also, make sure that there is at least one direction in the array before allowing to move to the next page.
   */
  const validatePage = () => {
    const recipe: Record<string, any> = { ...props.recipe }
    recipe.directions = directionArr;
    props.setRecipe(recipe);
    if (directionArr[0]) {
      return true;
    } else {
      const error = document.getElementById("error");
      if (error) {
        error.innerHTML = "You must have at least one direction"
      }
    }
  }

  return (
    <>
      <h2>Directons</h2>
      <div>
        <Input
          id="directionInput"
          type="text"
          label="Direction"
          state={newDirection}
          valid={true}
          onChange={e => {
            const regex = /[a-zA-Z0-9]/
            if (regex.test(e.target.value) || e.target.value == "") {
              setNewDirection(e.target.value)
            } else {
              const warning = document.getElementById("error");
              if (warning) warning.innerHTML = "A direction must contain only letters and numers."
            }
          }}
        />

        <button type="button" onClick={addDirection}>
          Add Directions
        </button>

        <EditableList list={directionArr} setList={setDirecitonArr} />
      </div>

      <p id="error" className="text-sm font-bold text-center text-red-400 my-3"></p>

      <NavButtons page={3} setState={props.setPage} validate={validatePage} />
    </>
  )
}

export default PageThree