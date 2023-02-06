import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import styles from "../../../public/styles/profile/my-recipe-box.module.scss";

const MyRecipeBox = () => {
  return (
    <>
      <h1>My Recipe Box</h1>
      <Link className={styles.newRecipeLink} href="./my-recipe-box/new-recipe">
        <FontAwesomeIcon icon={faPlus} />
      </Link>
    </>
  )
}

export default MyRecipeBox;