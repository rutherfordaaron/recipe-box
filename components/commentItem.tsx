import { Comment } from "../util/types";
import { useState } from "react";

const CommentItem = (props: { el: Comment, depth: number }) => {
  const [showComments, setShowComments] = useState(false);
  const { el } = props;
  return (
    <div>
      <p>{el.user}</p>
      <p>{el.body}</p>
      {!el.comments ? <></> : <p>Comments: {el.comments?.length}</p>}
      {!el.comments ? <></> : <button onClick={e => setShowComments(!showComments)}>Toggle Comments</button>}
      {!showComments || !el.comments ? <></> : el.comments.map((el, i) => {
        return (
          <CommentItem key={`${props.depth + 1}comment${i}`} depth={props.depth + 1} el={el} />
        )
      })}
    </div>
  )
}

export default CommentItem;