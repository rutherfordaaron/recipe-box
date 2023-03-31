import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Loading from "../../../components/loading";
import RecipeCard from "../../../components/RecipeCard";
import getUserRecipes from "../../../util/getUserRecipes";
import { useRouter } from "next/router";

const MyRecipeBox = () => {
  const router = useRouter();

  let { userRecipesData: data, userRecipesError: error, userRecipesIsLoading: isLoading } = getUserRecipes();

  return (
    <>
      <h1>My Recipe Box</h1>
      <div className="flex flex-col justify-center items-center gap-4">
        {isLoading ? <Loading /> : error ? <h1>Error</h1> : data && data.recipes ? data.recipes.map((el, i) => {
          return (
            <RecipeCard
              recipe={el}
              key={el._id?.toString()}
            />
          )
        }) : <></>}
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

export default MyRecipeBox;