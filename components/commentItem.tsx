import { Comment } from "../util/types";
import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownLeftAndUpRightToCenter, faReply, faTrash, faUpRightAndDownLeftFromCenter } from "@fortawesome/free-solid-svg-icons";
import getUser from "../util/getUser";
import Input from "./input";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { useSWRConfig } from "swr";
import { Spinner } from "./spinner";
import { DestructiveAction } from "./destructiveAction";
import { useRouter } from "next/router";

const CommentItem = (props: { el: Comment, recipeId: string, depth: number, map: number[] }) => {
  const [showComments, setShowComments] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [confrimDelete, setConfrimDelete] = useState(false);

  const router = useRouter();
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
            router.push({
              pathname: `/public-recipes/${recipeId}`,
              query: { message: "Comment created", good: true }
            }, `/public-recipes/${recipeId}`, { scroll: false })
          } else {
            router.push({
              pathname: `/public-recipes/${recipeId}`,
              query: { message: data.message }
            }, `/public-recipes/${recipeId}`, { scroll: false })
          }
        })
        .catch((err: Error) => {
          router.push({
            pathname: `/public-recipes/${recipeId}`,
            query: { message: err.message }
          }, `/public-recipes/${recipeId}`, { scroll: false })
        })
    } else {
      router.push({
        pathname: `/public-recipes/${recipeId}`,
        query: { message: "Please fill out comment input" }
      }, `/public-recipes/${recipeId}`, { scroll: false })
    }
    setLoading(false)
    setReply("");
    setShowReplyInput(false);
  }

  const deleteComment = () => {
    setLoading(true);
    setConfrimDelete(false);
    fetch("/api/comment", {
      method: "DELETE",
      headers:
      {
        "recipe-id": recipeId,
        "user": userData && userData.user ? userData.user.username : "",
        "comment-id": el._id.toString(),
        "index-map": JSON.stringify(map),
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          mutate(`/api/recipe?id=${recipeId}`);
          router.push({
            pathname: `/public-recipes/${recipeId}`,
            query: { message: "Comment Removed", good: true }
          }, `/public-recipes/${recipeId}`, { scroll: false })
        } else {
          router.push({
            pathname: `/public-recipes/${recipeId}`,
            query: { message: data.message }
          }, `/public-recipes/${recipeId}`, { scroll: false })
        }
      })
      .catch((err: Error) => {
        router.push({
          pathname: `/public-recipes/${recipeId}`,
          query: { message: `Something went wrong: ${err.message}` }
        }, `/public-recipes/${recipeId}`, { scroll: false })
      })
    setLoading(false);
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
      <div className="flex pb-2 items-center text-sky-300">
        {el.body === "[removed]" ? <></> :
          <button
            onClick={e => {
              if (userData && userData.user) {
                setShowReplyInput(!showReplyInput)
              } else {
                // push url with ereror
              }
            }}
            className={`${buttonStyle} text-xs`}
          >
            <FontAwesomeIcon icon={faReply} />
          </button>}

        {el.comments ?
          <button onClick={e => setShowComments(!showComments)} className={`flex gap-1 text-sm items-center justify-center ${buttonStyle}`}>
            {showComments ? <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} /> : <FontAwesomeIcon icon={faDownLeftAndUpRightToCenter} />}
            <p className="text-xs">{el.comments.length}</p>
          </button> : <></>}

        {userData && userData.user && userData.user.username == el.user ?
          <button onClick={e => setConfrimDelete(true)} className={`${buttonStyle} text-xs flex justify-center items-center gap-2`}>
            <FontAwesomeIcon icon={faTrash} />
            {loading ? <Spinner /> : <></>}
          </button> : <></>}
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
      <DestructiveAction
        message="Are you sure you want to delete this comment? Only this specific comment will be removed."
        destroyMessage="Yes, I'm sure"
        cancelMessage="No, nevermind"
        setVisible={setConfrimDelete}
        destructiveAction={deleteComment}
        visible={confrimDelete}
      />
    </motion.div>
  )
}

export default CommentItem;