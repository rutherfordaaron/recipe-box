import { Recipe, RecipeType, Ingredient, User } from "../util/types";
import { useRouter } from "next/router";
import Input from "./input";
import RadioButton from "./radioButton";
import EditableList from "./editableList";
import { useState } from "react";
import { uuid } from "uuidv4";
import MessageBanner from "./layout/messageBanner";
import { Spinner } from "./spinner";
import { BackButton } from "./backButton";
import { AnimatePresence, motion } from "framer-motion";

const RecipeEditMode = (props: { recipe: Recipe, setEditMode?: Function, editMode: boolean, user?: User }) => {
  let { recipe, setEditMode, editMode } = props;
  const router = useRouter();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // -------------------- BASIC INFO STATE VARIABLES --------------------
  const [recipePublic, setRecipePublic] = useState(recipe.public)
  const [name, setName] = useState(recipe.name ? recipe.name : "");
  const [nameValid, setNameValid] = useState(true);
  const [description, setDescription] = useState(recipe.description ? recipe.description : "");
  const [origin, setOrigin] = useState(recipe.origin ? recipe.origin : "");
  const [originValid, setOriginValid] = useState(true);
  const [recipeType, setRecipeType] = useState<RecipeType>(recipe.recipeType);
  const [activeTags, setActiveTags] = useState<string[]>(recipe.tags ? recipe.tags : [])
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
    if (newIngredient) {
      const ingredient = {
        measurement: newMeasurement.trim(),
        ingredient: newIngredient.trim(),
        id: uuid()
      };
      const tempIngredientArr = [...ingredients];
      tempIngredientArr.push(ingredient);
      setIngredients(tempIngredientArr);
      setNewIngredient("");
      setNewMeasurement("");
    } else {
      setError("Must have an ingredient name")
    }
  }

  // -------------------- ADD DIRECTIONS --------------------
  /**Add directions to the directionArr variable.
   * Clear the newDirection state variable after pushing new ingredient to directionArr
   */
  const addDirection = () => {
    if (newDirection) {
      const tempDirectionArr = [...directionArr];
      tempDirectionArr.push(newDirection.trim());
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

  // -------------------- ADD TAG --------------------
  const addTag = (value: string) => {
    let tags = [...activeTags];
    tags.push(value);
    setActiveTags(tags);
  }
  // -------------------- REMOVE TAG --------------------
  const removeTag = (value: string) => {
    let tags = [...activeTags];
    setActiveTags(tags.filter(el => el !== value))
  }
  // -------------------- CREATE TAG --------------------


  // -------------------- VALIDATE AND PATCH --------------------
  const validate = () => {
    if (!(name && origin && recipeType)) {
      setError("Please fill out name, origin, and recipeType");
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
    setLoading(true);
    const ready = validate();
    if (!ready) { setLoading(false); return };
    const newRecipe: Recipe = {
      _id: recipe._id,
      name: name.trim(),
      description: description.trim(),
      origin: origin.trim(),
      recipeType,
      owner: recipe.owner,
      ingredients,
      directions: directionArr,
      prepTime,
      cookTime,
      servings: servingsYield,
      rating,
      created: recipe.created,
      updated: editMode ? new Date() : undefined,
      tags: activeTags,
      public: recipePublic
    }
    fetch("/api/recipe", { method: editMode ? "PATCH" : "POST", headers: { recipe: JSON.stringify(newRecipe) } })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.error) {
          setError(`Error: ${data.message}. Please try again or contact support.`);
          setTimeout(() => {
            setError("");
          }, 4000)
        } else {
          router.push({ pathname: "/profile/my-recipe-box", query: { message: editMode ? "Recipe updated" : "Recipe created successfully", good: true } }, "/profile/my-recipe-box");
        }
      });
  }

  const cancelEdit = () => {
    if (setEditMode) setEditMode(false);
  }

  return (
    <div className="max-w-[500px] mx-auto">
      {editMode ? <></> : <BackButton href="/profile/my-recipe-box" />}
      <h1 className="text-center underline mb-8">{editMode ? "Edit Mode" : "New Recipe"}</h1>

      <form className="flex flex-col justify-center items-center gap-6 ">
        {/* -------------------- BASIC INFO SECTION ------------------- */}
        <div className="bg-slate-100 rounded-xl p-2 pb-4 w-[90%] flex flex-col justify-center items-center">
          <h2>Basic Info</h2>
          {/* -------------------- PUBLIC TOGGLE SWITCH ------------------- */}
          <button onClick={e => setRecipePublic(!recipePublic)} type="button" className={`rounded-full w-24 h-8 shadow-lg ${!recipePublic ? "bg-white" : "bg-sky-800 text-sky-100"} flex items-center relative hover:text-black transition-all`}>
            <div className={`w-6 h-6 rounded-full  absolute duration-500 z-30 ${recipePublic ? "right-1 bg-sky-300" : "right-16 bg-slate-300"} transition-all`} />
            <AnimatePresence>
              {recipePublic ?
                <motion.p
                  key="public"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: .5 }}
                  className="absolute left-2"
                >
                  Public
                </motion.p> :
                <motion.p
                  key="private"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: .5 }}
                  className="absolute right-2"
                >
                  Private
                </motion.p>}
            </AnimatePresence>
          </button>
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
            type="textarea"
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

          {/* -------------------- TAGS ------------------- */}
          <div className="w-full">
            <p className="text-lg pl-4 pt-4 pb-2">Tags:</p>
            {!props.user ? <Spinner /> :
              <div>
                <div>
                  {props.user.tags?.map((el, i) => {
                    if (activeTags.find(item => item === el)) {
                      return <button type="button" onClick={e => removeTag(el)} key={`tag${i}`} className="bg-sky-200 m-1 border-none shadow-sm">{el}</button>
                    }
                    return <button type="button" onClick={e => addTag(el)} key={`tag${i}`} className="bg-white m-1 border-none shadow-sm">{el}</button>
                  })}
                </div>
              </div>}
          </div>
        </div>

        {/* -------------------- INGREDIENTS SECTION ------------------- */}
        <div className="bg-slate-100 rounded-xl py-2 pb-4 w-[90%] flex flex-col justify-center items-center">
          <h2>Ingredients</h2>
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

          <button type="button" onClick={addIngredient} className="bg-white">
            Add Ingredient
          </button>

          <EditableList list={ingredients} setList={setIngredients} />
        </div>

        {/* -------------------- DIRECTIONS SECTION ------------------- */}
        <div className="bg-slate-100 rounded-xl py-2 pb-4 w-[90%] flex flex-col justify-center items-center">
          <h2>Directons</h2>
          <Input
            id="directionInput"
            type="textarea"
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

          <button type="button" onClick={addDirection} className="bg-white">
            Add Direction
          </button>

          <EditableList list={directionArr} setList={setDirecitonArr} />
        </div>

        {/* -------------------- TIME, YIELD, AND RATING SECTION ------------------- */}
        <div className="bg-slate-100 rounded-xl py-2 pb-4 w-[90%] flex flex-col justify-center items-center">
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
        </div>

        <MessageBanner message={error} ok={false} />
        {loading ? <Spinner /> :
          <div className="flex justify-center items-center gap-4">
            {editMode ?
              <>
                <button type="button" onClick={updateRecipe} className="border">Save</button>
                <button type="button" onClick={cancelEdit} className="border">Cancel</button>
              </> :
              <button type="button" onClick={updateRecipe} className="border">Submit</button>}
          </div>
        }
      </form>
    </div>
  )
}

export default RecipeEditMode;