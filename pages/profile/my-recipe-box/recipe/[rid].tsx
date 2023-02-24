import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import getUser from "../../../../util/getUser";
import { GetUserProps } from "../../../../util/getUser";
import { GetServerSideProps, NextPage } from "next";
import Loading from "../../../../components/loading";

const RecipeDetails: NextPage<GetUserProps> = (props) => {
  const user = JSON.parse(props.user);
  const router = useRouter();
  const { rid } = router.query

  const [recipe, setRecipe] = useState<Record<string, any> | number>({})
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/recipes/get-private-recipe", {
      method: "GET",
      headers: {
        "id": String(rid),
        "token": user.token,
        "user": user.username
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setRecipe(data.data);
        setLoading(false);
      })
  }, [])

  if (loading) {
    return (
      <Loading />
    )
  } else if (typeof recipe !== "number") {
    return (
      <article>
        <section>
          <h1>{recipe.name}</h1>
          <p>{!recipe.rating ? "" : recipe.rating}</p>
          <p>{recipe.description}</p>
          <div>
            <p>Prep Time: {!recipe.prepTime ? "unknown" : recipe.prepTime}</p>
            <p>Cook Time: {!recipe.cookTime ? "unknown" : recipe.cookTime}</p>
          </div>
          <p>Servings: {!recipe.servingsYield ? "unknown" : recipe.servingsYield}</p>
        </section>

        <section>
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients.map((el: string[][], i: number) => {
              return (
                <li key={`${recipe._id}Ingredient${i}`}>{el[0]} of {el[1]}</li>
              )
            })}
          </ul>
        </section>

        <section>
          <h2>Directions</h2>
          <ol>
            {recipe.directions.map((el: string[][], i: number) => {
              return (
                <li key={`${recipe._id}Direction${i}`}>{el}</li>
              )
            })}
          </ol>
        </section>
        <button type="button">Edit</button>
        <button type="button">Delete</button>
      </article>
    )
  } else {
    return (
      <>
        <h1>Error {recipe}</h1>
        <p>Looks like something went wrong! You may not be logged into the right account to access this recipe. Please try logging in to another account.</p>
      </>
    )
  }
}

export const getServerSideProps: GetServerSideProps<GetUserProps> = async (context) => {
  return await getUser(context);
}

export default RecipeDetails