import { Recipe } from "../../util/types";
import { useRouter } from "next/router";
import { ObjectId } from "mongodb";

const NavButtons = (props: { page: number, setState: Function, validate: Function, recipe?: Record<string, any>, owner?: string }) => {

  const router = useRouter();

  const submitNewRecipe = async (recipe: Record<string, any> | undefined, owner: string | undefined) => {
    if (recipe && owner) {
      const newRecipe: Recipe = {
        name: recipe.name,
        description: recipe.description,
        owner: owner,
        origin: recipe.origin,
        recipeType: recipe.recipeType,
        ingredients: recipe.ingredients,
        directions: recipe.directions,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servingsYield,
        rating: recipe.rating
      }

      const recipeString = JSON.stringify(newRecipe);

      const response = await fetch(`/api/recipe`,
        {
          method: "POST",
          headers: {
            "recipe": recipeString
          }
        })
      const data = await response.json();
      if (data.success) {
        router.push("/profile/my-recipe-box?new-recipe=true");
      } else {
        router.push(`/profile/my-recipe-box?new-recipe=false&reason=${data.reason}`);
      }

    }
  }

  return (
    <div className="flex justify-center gap-3 my-4">
      <button
        type="button"
        onClick={() => props.setState(props.page <= 1 ? 1 : props.page - 1)}
        className={props.page <= 1 ? "hidden" : ""}
      >
        Prev
      </button>
      <button
        type="button"
        onClick={() => {
          if (props.validate()) {
            if (props.page === 5) {
              submitNewRecipe(props.recipe, props.owner)
            } else {
              props.setState(props.page >= 5 ? 5 : props.page + 1);
            }
          }
        }}
      >
        {props.page === 5 ? "Submit" : "Next"}
      </button>
    </div>
  )
}

export default NavButtons