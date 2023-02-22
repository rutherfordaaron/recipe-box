import NavButtons from "./NavButtons";
import Input from "../input/input";
import { useState } from "react";

const PageFour = (props: { recipe: Record<string, any>, setRecipe: Function, setPage: Function }) => {
  // State Variables
  const [prepTime, setPrepTime] = useState(props.recipe.prepTime | 0);
  const [cookTime, setCookTime] = useState(props.recipe.cookTime | 0);
  const [servingsYield, setServingsYield] = useState(props.recipe.servingsYield | 0);

  const validatePage = () => {
    const recipe: Record<string, any> = { ...props.recipe }
    recipe.prepTime = prepTime === 0 ? undefined : prepTime;
    recipe.cookTime = cookTime === 0 ? undefined : cookTime;
    recipe.servingsYield = servingsYield === 0 ? undefined : servingsYield;
    props.setRecipe(recipe);
    return true;
  }

  return (
    <>
      <h2>Time and Yield</h2>
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

      <NavButtons page={4} setState={props.setPage} validate={validatePage} />
    </>
  )
}

export default PageFour;