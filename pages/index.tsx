import Link from "next/link";
import getPublicRecipes from "../util/getPublicRecieps";
import { Spinner } from "../components/spinner";
import { Recipe } from "../util/types";
import RecipeCard from "../components/RecipeCard";

export default function Home() {
  const { publicRecipesData: data, publicRecipesError: error, publicRecipesIsLoading: loading } = getPublicRecipes();

  return (
    <>
      <h1 className="text-3xl font-bold">Welcome to Recipe Box!</h1>
      <div className="flex gap-4">
        <Link href="/login" className="bg-sky-300 shadow-lg rounded py-2 px-4 hover:bg-sky-200 transition-all">Login</Link>
        <Link href="/sign-up" className="bg-sky-300 shadow-lg rounded py-2 px-4 hover:bg-sky-200 transition-all">Signup</Link>
      </div>
      <div className="mt-8">
        {loading ? <Spinner /> : error ? <p>Error: {error.message}</p> : data && data.recipes ?
          <div className="grid grid-cols-1 gap-4">
            {data.recipes.map((el, i) => {
              return (
                <div key={`publicRecipe${i}`}>
                  <RecipeCard recipe={el} forPublic={true} />
                </div>
              )
            })}
          </div> : <></>}
      </div>
    </>
  )
}