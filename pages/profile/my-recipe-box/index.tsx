import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { NextPage } from "next";
import getUser from "../../../util/getUser";
import { GetUserProps } from "../../../util/getUser";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import Loading from "../../../components/loading";
import RecipeCard from "../../../components/recipe-card/RecipeCard";

const MyRecipeBox: NextPage<GetUserProps> = (props) => {
  const user = JSON.parse(props.user);
  const [loading, setLoading] = useState(true);
  const [userRecipes, setUserRecipes] = useState<Record<string, any>[] | string>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/user-recipes", {
      method: "GET",
      headers: {
        "user": user.username
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(true);
        }
        setUserRecipes(data.data);
        setLoading(false);

      })
  }, [])

  if (!error) {
    return (
      <>
        <h1>My Recipe Box</h1>
        <div className="flex flex-col justify-center items-center gap-4">
          {loading ? <Loading /> : typeof userRecipes !== "string" ? userRecipes.map((el, i) => {
            return (
              <RecipeCard
                key={`recipeCard${i}`}
                id={el._id}
                name={el.name}
                description={el.description}
                recipeType={el.recipeType}
                origin={el.origin}
                prepTime={el.prepTime}
                cookTime={el.cookTime}
                rating={el.rating}
              />
            )
          }) : <p>Something went wrong. Please try again</p>}
        </div>
        <Link
          className="fixed bottom-5 right-5 text-5xl bg-sky-500 shadow-md w-20 h-20
         flex justify-center items-center rounded-full 
         hover:bg-sky-300 hover:shadow-none hover:bottom-4 hover:text-gray-800 
         transition-all"
          href="./my-recipe-box/new-recipe"
        >
          <FontAwesomeIcon icon={faPlus} />
        </Link>
      </>
    )
  } else {
    return (
      <>
        <h1>Something went wrong!</h1>
        <p>Error: {typeof userRecipes === "string" ? userRecipes : ""}</p>
      </>
    )
  }
}

export const getServerSideProps: GetServerSideProps<GetUserProps> = async (context) => {
  return await getUser(context);
}

export default MyRecipeBox;