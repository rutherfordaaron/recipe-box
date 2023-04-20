import { Comment } from "../util/types";
import { useState } from "react";
import CommentPreview from "./commentPreview";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import getUser from "../util/getUser";
import Input from "./input";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { useSWRConfig } from "swr";
import { Spinner } from "./spinner";

const CommentItem = (props: { el: Comment, recipeId: string, depth: number, map: number[] }) => {
  const [showComments, setShowComments] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const { userData } = getUser();
  const { mutate } = useSWRConfig();
  const { el, recipeId, depth, map } = props;

  const buttonStyle = "transition-all shadow-none hover:bg-transparent hover:text-sky-600";

  const submitReply = () => {
    let newReply = reply.trim();
    if (newReply) {
      setLoading(true)
      fetch("/api/comment", {
        method: "POST",
        headers:
        {
          "recipe-id": recipeId,
          "user": userData && userData.user ? userData.user.username : "",
          "new-comment": reply,
          "index-map": JSON.stringify(map),
          "depth": (depth + 1).toString()
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            mutate(`/api/recipe?id=${recipeId}`);
            // push with succes url param
            console.log("success")
          } else {
            // push with unsuccessful url param
            console.log("fail")
          }
          setLoading(false);
          setReply("");
          setShowReplyInput(false);
        })
        .catch((err: Error) => {
          // push with error
          setLoading(false);
          setReply("");
          setShowReplyInput(false);
          console.log("fail")
        })
    } else {
      // push with error
      setLoading(false);
      setReply("");
      setShowReplyInput(false);
      console.log("fail")
    }
  }

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
      <p>Depth: {depth}</p>
      <p>Map: {JSON.stringify(map)}</p>
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
          <button onClick={submitReply} className="shadow-none text-sky-400 hover:bg-transparent hover:text-sky-600 flex items-center justify-center gap-4">
            <FontAwesomeIcon icon={faPaperPlane} />
            {loading ? <Spinner /> : <></>}
          </button>
        </div> : <></>}

      {!showComments || !el.comments ? <></> : el.comments.map((el, i) => {
        const newMap = [...map];
        newMap.push(i)
        return (
          <CommentItem key={`${depth + 1}comment${i}`} depth={props.depth + 1} el={el} recipeId={recipeId} map={newMap} />
        )
      })}
    </motion.div>
  )
}

export default CommentItem;