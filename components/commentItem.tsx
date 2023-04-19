import { Comment } from "../util/types";
import { useState } from "react";
import CommentPreview from "./commentPreview";
import { getCommentCount } from "../util/getCommentCount";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faReply } from "@fortawesome/free-solid-svg-icons";

const CommentItem = (props: { el: Comment, depth: number }) => {
  const [showComments, setShowComments] = useState(false);
  const { el } = props;

  const getIndent = (depth: number) => {
    switch (depth) {
      case 0: return "ml-[10px]"
      case 1: return "ml-[20px]"
      case 2: return "ml-[30px]"
      case 4: return "ml-[40px]"
      case 3: return "ml-[50px]"
      case 5: return "ml-[60px]"
      case 6: return "ml-[70px]"
    }
  }

  const buttonStyle = "transition-all shadow-none hover:bg-transparent hover:text-sky-600"
  return (
    <div className={`border-b border-t pl-5 pt-2 ${getIndent(props.depth)}`}>
      <p className="text-sky-200 text-sm">{el.user}</p>
      <p className="pl-6 my-2">{el.body}</p>
      <div className="flex gap-2 items-center text-sky-300">
        <button className={`${buttonStyle} text-xs`}><FontAwesomeIcon icon={faReply} /></button>
        <CommentPreview count={el.comments ? el.comments.length : 0} />
        <button onClick={e => setShowComments(!showComments)} className={`${showComments ? "rotate-180" : ""} ${buttonStyle}`}><FontAwesomeIcon icon={faCaretDown} /></button>
      </div>
      {!showComments || !el.comments ? <></> : el.comments.map((el, i) => {
        return (
          <CommentItem key={`${props.depth + 1}comment${i}`} depth={props.depth + 1} el={el} />
        )
      })}
    </div>
  )
}

export default CommentItem;