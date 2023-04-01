import NavButtons from "./NavButtons";
import Input from "../input";
import { useState } from "react";

const PageFive = (props: { recipe: Record<string, any>, setRecipe: Function, setPage: Function, owner: string, setLoading: Function }) => {
  const [rating, setRating] = useState(0);

  const validatePage = () => {
    const recipe: Record<string, any> = { ...props.recipe }
    recipe.rating = rating === 0 ? undefined : [rating];
    props.setRecipe(recipe);
    return true;
  }

  return (
    <>
      <h2>Rating</h2>
      <Input
        id="rating"
        type="number"
        label="Rating (1-10)"
        onChange={(e) => {
          const value = Number(e.target.value);
          setRating(value <= 10 && value > 0 ? value : 0)
        }}
        state={rating === 0 ? "" : rating}
        valid={true}
        range={[1, 10]}
      />
      <NavButtons page={5} setState={props.setPage} validate={validatePage} recipe={props.recipe} owner={props.owner} setLoading={props.setLoading} />
    </>
  )
}

export default PageFive;