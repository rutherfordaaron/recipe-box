import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Loading from "../../../components/loading";
import RecipeCard from "../../../components/recipe-card/RecipeCard";
import getUserRecipes from "../../../util/getUserRecipes";

const MyRecipeBox = () => {

  let { userRecipesData: data, userRecipesError: error, userRecipesIsLoading: isLoading } = getUserRecipes();

  return (
    <>
      <h1>My Recipe Box</h1>
      <div className="flex flex-col justify-center items-center gap-4">
        {isLoading ? <Loading /> : error ? <h1>Error</h1> : data && data.recipes ? data.recipes.map((el, i) => {
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