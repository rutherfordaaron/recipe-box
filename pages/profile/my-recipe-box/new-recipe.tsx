import { useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import getUser from "../../../util/getUser";
import { GetUserProps } from "../../../util/getUser";
import PageOne from "../../../components/new-recipe-form/Page1";
import PageTwo from "../../../components/new-recipe-form/Page2";
import PageThree from "../../../components/new-recipe-form/Page3";
import PageFour from "../../../components/new-recipe-form/Page4";
import PageFive from "../../../components/new-recipe-form/Page5";



const NewRecipe: NextPage<GetUserProps> = (props) => {
  const user = JSON.parse(props.user);
  // State page variable to track which page of the form should render
  const [page, setPage] = useState(1);
  const [recipe, setRecipe] = useState({});

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
        return <PageFive setRecipe={setRecipe} recipe={recipe} setPage={setPage} owner={owner} />
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