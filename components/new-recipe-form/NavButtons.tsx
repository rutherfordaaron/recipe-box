import styles from "../../public/styles/profile/new-recipe-form.module.scss";

const NavButtons = (props: { page: number, setState: Function, validate: Function }) => {
  return (
    <div className={styles.navButtonContainer}>
      <button
        type="button"
        onClick={() => props.setState(props.page === 1 ? 1 : props.page - 1)}
        className={props.page === 1 ? "noDisplay" : ""}
      >
        Prev
      </button>
      <button
        type="button"
        onClick={() => {
          if (props.validate()) {
            props.setState(props.page === 5 ? 5 : props.page + 1);
          }
        }}
        className={props.page === 5 ? "noDisplay" : ""}
      >
        Next
      </button>
    </div>
  )
}

export default NavButtons