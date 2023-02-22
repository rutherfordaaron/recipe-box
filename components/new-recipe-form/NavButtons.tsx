import Recipe from "../../models/recipe";
import styles from "../../public/styles/profile/new-recipe-form.module.scss";
import { useRouter } from "next/router";

const NavButtons = (props: { page: number, setState: Function, validate: Function, recipe?: Record<string, any>, owner?: string }) => {

  const router = useRouter();

  const submitNewRecipe = async (recipe: Record<string, any> | undefined, owner: string | undefined) => {
    if (recipe && owner) {
      const newRecipe = new Recipe(
        recipe.name,
        recipe.description,
        owner,
        recipe.origin,
        recipe.recipeType,
        recipe.ingredients,
        recipe.directions,
        recipe.prepTime,
        recipe.cookTime,
        recipe.servingsYield,
        recipe.rating
      );

      const recipeString = JSON.stringify(newRecipe);

      const response = await fetch(`/api/recipes/new-recipe`,
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
        router.push("/profile/my-recipe-box?new-recipe=false")
      }

    }
  }

  return (
    <div className={styles.navButtonContainer}>
      <button
        type="button"
        onClick={() => props.setState(props.page <= 1 ? 1 : props.page - 1)}
        className={props.page <= 1 ? "noDisplay" : ""}
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