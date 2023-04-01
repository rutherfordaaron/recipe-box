import { useState } from "react";
import { useRouter } from "next/router";
import getUser from "../../../util/getUser";
import PageOne from "../../../components/new-recipe-form/Page1";
import PageTwo from "../../../components/new-recipe-form/Page2";
import PageThree from "../../../components/new-recipe-form/Page3";
import PageFour from "../../../components/new-recipe-form/Page4";
import PageFive from "../../../components/new-recipe-form/Page5";
import Loading from "../../../components/loading";



const NewRecipe = () => {
  const { userData, userError, userIsLoading } = getUser();
  // State page variable to track which page of the form should render
  const [page, setPage] = useState(1);
  const [recipe, setRecipe] = useState({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  let owner = userData && userData.user ? userData.user.username : "";

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
        return <PageFive setRecipe={setRecipe} recipe={recipe} setPage={setPage} owner={owner} setLoading={setLoading} />
    }
  }

  if (userIsLoading) return <Loading />
  if (userError) return <p>Something wend wrong! {userError.message}</p>
  if (userData && !userData.user) router.push(`/login?error=${userData.message}`);

  return (
    <form className="flex flex-col justify-center items-center">
      {getFormPage(page)}
    </form>
  )
}

export default NewRecipe;