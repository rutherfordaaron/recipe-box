import { Comment } from "../util/types";
import { useState } from "react";
import CommentPreview from "./commentPreview";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMailReply, faReply } from "@fortawesome/free-solid-svg-icons";
import Input from "./input";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";

const CommentItem = (props: { el: Comment, depth: number }) => {
  const [showComments, setShowComments] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [reply, setReply] = useState("");
  const { el } = props;

  const buttonStyle = "transition-all shadow-none hover:bg-transparent hover:text-sky-600"
  return (
    <motion.div
      className={`border-b relative border-t pl-3 pt-2`}
      initial={{ scaleY: 0, originY: 0 }}
      animate={{ scaleY: 1 }}
      exit={{ scaleY: 0 }}
    >
      <div className="absolute left-0 h-[calc(100%-20px)] top-[10px] border border-sky-100" />
      <p className="text-sky-300 text-sm">{el.user}</p>
      <p className="pl-6 my-2 text-sm text-gray-600">{el.body}</p>
      <div className="flex gap-2 items-center text-sky-300">
        <button onClick={e => setShowReplyInput(!showReplyInput)} className={`${buttonStyle} text-xs`}>
          <FontAwesomeIcon icon={faReply} />
        </button>

        <button onClick={e => setShowComments(!showComments)} className={buttonStyle}>
          <CommentPreview count={el.comments ? el.comments.length : 0} />
        </button>
      </div>

      {showReplyInput ?
        <div className="flex gap-2 items-center pl-4">
          <div>
            <Input
              id={`comment${el._id}`}
              type="textarea"
              label="Your comment"
              state={reply}
              onChange={e => setReply(e.target.value)}
              valid={!!reply}
            />
          </div>
          <button className="shadow-none text-sky-400 hover:bg-transparent hover:text-sky-600">
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div> : <></>}

      {!showComments || !el.comments ? <></> : el.comments.map((el, i) => {
        return (
          <CommentItem key={`${props.depth + 1}comment${i}`} depth={props.depth + 1} el={el} />
        )
      })}
    </motion.div>
  )
}

export default CommentItem;