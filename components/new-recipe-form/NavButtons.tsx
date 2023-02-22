import styles from "../../public/styles/profile/new-recipe-form.module.scss";

const NavButtons = (props: { page: number, setState: Function, validate: Function, recipe?: Record<string, any>, owner?: string }) => {

  const submitNewRecipe = (recipe: Record<string, any> | undefined, owner: string | undefined) => {
    console.log("recipe: ", recipe);
    console.log("ownder: ", owner);
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