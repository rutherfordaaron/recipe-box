import { useState } from "react";
import { useRouter } from "next/router";
import getUser from "../../../util/getUser";
import Loading from "../../../components/loading";
import RecipeEditMode from "../../../components/recipeView/recipeDetails/recipeEditMode";
import { Recipe, RecipeType } from "../../../util/types";



const NewRecipe = () => {
  const { userData, userError, userIsLoading } = getUser();
  let owner = userData && userData.user ? userData.user.username : "";
  const emptyRecipe: Recipe = {
    name: "",
    owner,
    origin: "",
    ratings: [{ user: owner, rating: 5 }],
    recipeType: RecipeType.Copied,
    ingredients: [],
    directions: [],
    created: new Date()
  }
  // State page variable to track which page of the form should render
  const [page, setPage] = useState(1);
  const [recipe, setRecipe] = useState({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  if (userIsLoading) return <Loading />
  if (userError) return <p>Something wend wrong! {userError.message}</p>
  if (userData && !userData.user) router.push(`/login?error=${userData.message}`);

  return (
    <>
      {/* {getFormPage(page)} */}
      <RecipeEditMode editMode={false} recipe={emptyRecipe} user={userData && userData.user ? userData.user : undefined} />
    </>
  )
}

export default NewRecipe;