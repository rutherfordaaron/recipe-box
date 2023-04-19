import { Comment } from "../util/types";
import CommentItem from "./commentItem";

const Comments = (props: { comments: Comment[] }) => {
  const mapComments = (arr: Comment[]) => {
    return arr.map((el, i) => {
      return (
        <CommentItem el={el} depth={0} />
      )
    })
  }

  return (
    <div>
      {mapComments(props.comments)}
    </div>
  )
}

export default Comments;