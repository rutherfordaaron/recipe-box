import { Recipe } from "../../../util/types";

const IngredientsAndDirections = (props: { recipe: Recipe }) => {
  const { recipe } = props;
  return (
    <>
      <section>
        <h2 className="border-b-2 border-sky-900">Ingredients</h2>
        <ul>
          {recipe.ingredients.map((el, i) => {
            return (
              <li key={`${recipe._id}Ingredient${i}`}>{el.measurement} {/[a-zA-Z]/.test(el.measurement) ? "of " : ""}{el.ingredient}</li>
            )
          })}
        </ul>
      </section>

      <section>
        <h2 className="border-b-2 border-sky-900">Directions</h2>
        <ol className="flex flex-col gap-3">
          {recipe.directions.map((el, i) => {
            return (
              <li key={`${recipe._id}Direction${i}`}>{el}</li>
            )
          })}
        </ol>
      </section>
    </>
  )
}

export default IngredientsAndDirections;