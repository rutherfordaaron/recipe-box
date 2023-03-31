import { Recipe, RecipeType, Ingredient } from "../util/types";
import { useRouter } from "next/router";
import Input from "./input";
import RadioButton from "./radioButton";
import EditableList from "./editableList";
import { useState } from "react";
import { uuid } from "uuidv4";
import MessageBanner from "./layout/messageBanner";

const RecipeEditMode = (props: { recipe: Recipe, setEditMode: Function }) => {
  let { recipe, setEditMode } = props;
  const router = useRouter();

  const [error, setError] = useState("");
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
  const [ingredients, setIngredients] = useState<Ingredient[]>(recipe.ingredients ? [...recipe.ingredients] : []);
  // -------------------- DIRECTIONS STATE VARIABLES --------------------
  const [newDirection, setNewDirection] = useState("");
  const [directionArr, setDirecitonArr] = useState<string[]>(recipe.directions ? [...recipe.directions] : []);
  // -------------------- TIME, YIELD, AND RATING STATE VARIABLES --------------------
  const [prepTime, setPrepTime] = useState(recipe.prepTime ? recipe.prepTime : 0);
  const [cookTime, setCookTime] = useState(recipe.cookTime ? recipe.cookTime : 0);
  const [servingsYield, setServingsYield] = useState(recipe.servings ? recipe.servings : 0);
  const [rating, setRating] = useState(recipe.rating);
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

  // -------------------- ADD INGREDIENTS --------------------
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

  // -------------------- ADD DIRECTIONS --------------------
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

  // -------------------- VALIDATE AND PATCH --------------------
  const validate = () => {
    if (!(name && description && origin && recipeType)) {
      setError("Please fill out name, description, origin, and recipeType");
      setTimeout(() => {
        setError("");
      }, 4000)
      return false
    } else if (!(directionArr[0] && ingredients[0])) {
      setError("Please make sure you have at least one ingredient and one direction");
      setTimeout(() => {
        setError("");
      }, 4000)
      return false
    } else {
      return true;
    }
  }

  const updateRecipe = () => {
    const ready = validate();
    if (!ready) return;
    const newRecipe: Recipe = {
      name,
      description,
      origin,
      recipeType: typeof recipeType === "string" ? RecipeType.Copied : recipeType,
      owner: recipe.owner,
      ingredients,
      directions: directionArr,
      prepTime,
      cookTime,
      servings: servingsYield,
      rating
    }
    fetch("/api/recipe", { method: "PATCH", headers: { recipe: JSON.stringify(newRecipe) } })
      .then(res => res.json())
      .then(data => { console.log(data) });
    // router.push({ pathname: "/profile/my-recipe-box", query: { message: "Recipe updated", good: true } }, "/profile/my-recipe-box");
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

        {/* -------------------- INGREDIENTS SECTION ------------------- */}
        <h2>Ingredients</h2>
        <div>
          <Input
            id="measurementInput"
            type="text"
            label="New Measurement"
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

        {/* -------------------- DIRECTIONS SECTION ------------------- */}
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

        {/* -------------------- TIME, YIELD, AND RATING SECTION ------------------- */}

        <h2>Time, Yield, and Rating</h2>
        <Input
          id="prepTime"
          type="number"
          label="Prep Time (Minutes)"
          onChange={(e) => {
            const value = Number(e.target.value);
            setPrepTime(value <= 100000 && value > 0 ? value : 0)
          }} state={prepTime <= 0 || typeof prepTime !== "number" ? "" : prepTime}
          valid={true}
          range={[1, 100000]}
        />
        <Input
          id="cookTime"
          type="number"
          label="Cook Time (Minutes)"
          onChange={(e) => {
            const value = Number(e.target.value);
            setCookTime(value <= 100000 && value > 0 ? value : 0)
          }}
          state={cookTime <= 0 || typeof cookTime !== "number" ? "" : cookTime}
          valid={true}
          range={[1, 100000]}
        />
        <Input
          id="servingsYield"
          type="number"
          label="Servings Yield"
          onChange={(e) => {
            const value = Number(e.target.value);
            setServingsYield(value <= 100000 && value > 0 ? value : 0)
          }}
          state={servingsYield === 0 ? "" : servingsYield}
          valid={true}
          range={[1, 100000]}
        />
        <Input
          id="rating"
          type="number"
          label="Rating (1-10)"
          onChange={(e) => {
            const value = Number(e.target.value);
            if (rating) {
              let tempRating = [...rating];
              tempRating[0] = value <= 10 && value > 0 ? value : 0
              setRating(tempRating);
            } else {
              setRating([value <= 10 && value > 0 ? value : 0])
            }
          }}
          state={rating && rating[0] === 0 ? "" : rating ? rating[0] : ""}
          valid={true}
          range={[1, 10]}
        />

        <MessageBanner message={error} ok={false} />
        <button type="button" onClick={updateRecipe}>Save</button>
        <button type="button" onClick={cancelEdit}>Cancel</button>
      </form>
    </>
  )
}

export default RecipeEditMode;