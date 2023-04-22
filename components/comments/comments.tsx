import { AnimatePresence } from "framer-motion";
import { Comment } from "../../util/types";
import CommentItem from "./commentItem";

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
      <div>
        {mapComments(props.comments)}
      </div>
    </AnimatePresence>
  )
}

export default Comments;