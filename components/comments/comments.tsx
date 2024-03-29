import { AnimatePresence } from "framer-motion";
import { Comment } from "../../util/types";
import CommentItem from "./commentItem";

// Map over all the comments of a given comment array

const Comments = (props: { comments: Comment[], recipeId: string }) => {
  const mapComments = (arr: Comment[]) => {
    return arr.map((el, i) => {
      return (
        <CommentItem el={el} depth={0} key={`${0}comment${i}`} recipeId={props.recipeId} map={[i]} />
      )
    })
  }

  return (
    <AnimatePresence>
      <div className="mt-10">
        {mapComments(props.comments)}
      </div>
    </AnimatePresence>
  )
}

export default Comments;