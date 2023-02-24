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
  const [userRecipes, setUserRecipes] = useState<Record<string, any>[]>([])

  useEffect(() => {
    fetch("/api/recipes/get-user-recipes", {
      method: "GET",
      headers: {
        "user": user.username
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setUserRecipes(data.data);
        setLoading(false);
      })
  }, [])

  return (
    <>
      <h1>My Recipe Box</h1>
      <div className="flex flex-col justify-center items-center gap-4">
        {loading ? <Loading /> : userRecipes.map((el, i) => {
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
        })}
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
}

export const getServerSideProps: GetServerSideProps<GetUserProps> = async (context) => {
  return await getUser(context);
}

export default MyRecipeBox;