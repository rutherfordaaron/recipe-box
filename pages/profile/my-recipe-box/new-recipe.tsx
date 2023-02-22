import { useState } from "react";
import Recipe, { RecipeType } from "../../../models/recipe";
import { GetServerSideProps, NextPage } from "next";
import getUser from "../../../util/getUser";
import { GetUserProps } from "../../../util/getUser";
import styles from "../../../public/styles/profile/new-recipe-form.module.scss";
import PageOne from "../../../components/new-recipe-form/Page1";
import PageTwo from "../../../components/new-recipe-form/Page2";
import PageThree from "../../../components/new-recipe-form/Page3";
import PageFour from "../../../components/new-recipe-form/Page4";



const NewRecipe: NextPage<GetUserProps> = (props) => {
  const user = JSON.parse(props.user);
  // State page variable to track which page of the form should render
  const [page, setPage] = useState(1);
  const [recipe, setRecipe] = useState({});

  // State variables that will be used to create new recipe object
  // ***** All of this will be moved into their own components *****

  // // form page 2
  // const [ingredients, setIngredients] = useState<undefined | string[][]>(undefined);

  // // form page 3
  // const [directions, setDirections] = useState<undefined | string[]>(undefined);

  // // form page 4
  // const [prepTime, setPrepTime] = useState<undefined | number>(undefined);
  // const [cookTime, setCookTime] = useState<undefined | number>(undefined);
  // const [servingsYield, setServingsYield] =
  //   useState<[(number | undefined), (number | undefined)] | undefined>(undefined);

  // // form page 5
  // const [rating, setRating] = useState<undefined | number[]>(undefined);

  let owner = user.username;

  const getFormPage = (page: number) => {
    switch (page) {
      case 1:
        return <PageOne setRecipe={setRecipe} recipe={recipe} setPage={setPage} />
      case 2:
        return <PageTwo setRecipe={setRecipe} recipe={recipe} setPage={setPage} />
      case 3:
        return <PageThree setRecipe={setRecipe} recipe={recipe} setPage={setPage} />
      case 4:
        return <PageFour setRecipe={setRecipe} recipe={recipe} setPage={setPage} />
      default:
        return <>5</>
    }
  }

  return (
    <form>
      {getFormPage(page)}
    </form>
  )
}

export const getServerSideProps: GetServerSideProps<GetUserProps> = async (context) => {
  return await getUser(context);
}

export default NewRecipe;