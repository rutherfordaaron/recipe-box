import { Comment } from "../../util/types";
import { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownLeftAndUpRightToCenter, faReply, faTrash, faUpRightAndDownLeftFromCenter } from "@fortawesome/free-solid-svg-icons";
import getUser from "../../util/getUser";
import Input from "../input";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { useSWRConfig } from "swr";
import { Spinner } from "../spinner";
import { DestructiveAction } from "../layout/destructiveAction";
import { useRouter } from "next/router";

const CommentItem = (props: { el: Comment, recipeId: string, depth: number, map: number[] }) => {
  // State variables
  const [showComments, setShowComments] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [confrimDelete, setConfrimDelete] = useState(false);

  // Hook and utility variables
  const router = useRouter();
  const { userData } = getUser();
  const { mutate } = useSWRConfig();

  // Destructured props
  const { el, recipeId, depth, map } = props;

  // Sumbit reply to a comment to create a nested comment
  const submitReply = () => {
    // Trim the whitespace off the reply
    let newReply = reply.trim();
    // If anything is left over, set Loading to true to show a spinner
    if (newReply) {
      setLoading(true)
      // Then, POST to "/api/comment" and provide required data
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
        // Parse the return JSON
        .then(res => res.json())
        .then(data => {
          // If request was successful, refresh recipe data and push to this route with query to show success message
          if (data.success) {
            mutate(`/api/recipe?id=${recipeId}`);
            router.push({
              pathname: `/public-recipes/${recipeId}`,
              query: { message: "Comment created", good: true }
            }, `/public-recipes/${recipeId}`, { scroll: false })
          } else {
            // If API call wasn't successful, push to this route to show an error message
            router.push({
              pathname: `/public-recipes/${recipeId}`,
              query: { message: data.message }
            }, `/public-recipes/${recipeId}`, { scroll: false })
          }
        })
        // If an error occures during API call, push to this route and show the error message
        .catch((err: Error) => {
          router.push({
            pathname: `/public-recipes/${recipeId}`,
            query: { message: err.message }
          }, `/public-recipes/${recipeId}`, { scroll: false })
        })
    } else {
      // If no reply exists after a the trim, push to this route to show error message
      router.push({
        pathname: `/public-recipes/${recipeId}`,
        query: { message: "Please fill out comment input" }
      }, `/public-recipes/${recipeId}`, { scroll: false })
    }
    // Reset reply input and loading state and hide the input field
    setLoading(false)
    setReply("");
    setShowReplyInput(false);
  }

  // Redact a comment the user owns
  const deleteComment = () => {
    // Show loading spinner and hide destructive action confirmation
    setLoading(true);
    setConfrimDelete(false);
    // Create DELETE request to "/api/comment" with required data
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
      // Parse res object
      .then(res => res.json())
      .then(data => {
        // If API call was successful, refresh recipe data and push to same route to show success message
        if (data.success) {
          mutate(`/api/recipe?id=${recipeId}`);
          router.push({
            pathname: `/public-recipes/${recipeId}`,
            query: { message: "Comment Removed", good: true }
          }, `/public-recipes/${recipeId}`, { scroll: false })
        } else {
          // If API call wasn't successful, push to same route to show error message
          router.push({
            pathname: `/public-recipes/${recipeId}`,
            query: { message: data.message }
          }, `/public-recipes/${recipeId}`, { scroll: false })
        }
      })
      // If error occurs during API call, push to same route and show error message
      .catch((err: Error) => {
        router.push({
          pathname: `/public-recipes/${recipeId}`,
          query: { message: `Something went wrong: ${err.message}` }
        }, `/public-recipes/${recipeId}`, { scroll: false })
      })
    // Remove loading spinner after a response or error is recieved
    setLoading(false);
  }

  return (
    <motion.div
      className={`border-b relative border-t pl-3 pt-2`}
      initial={{ scaleY: 0, originY: 0 }}
      animate={{ scaleY: 1 }}
      exit={{ scaleY: 0 }}
    >
      {/* Left border with space above and below */}
      <div className="absolute left-0 h-[calc(100%-20px)] top-[10px] border border-sky-100" />
      {/* Comment body with name of user */}
      <p className="text-sky-300 text-sm">{el.user}</p>
      <p className="pl-6 my-2 text-sm text-gray-600">{el.body}</p>

      <div className="flex pb-2 items-center text-sky-300">
        {/* If comment is not removed, show a reply button */}
        {el.body === "[removed]" ? <></> :
          <button
            onClick={e => {
              // If user is not logged in, show error message when attempting to reply to comments
              if (userData && userData.user) {
                setShowReplyInput(!showReplyInput)
              } else {
                router.push({
                  pathname: `/public-recipes/${recipeId}`,
                  query: { message: "Please log in to reply to comments" }
                }, `/public-recipes/${recipeId}`, { scroll: false })
              }
            }}
            className={`icon-button text-xs`}
          >
            <FontAwesomeIcon icon={faReply} />
          </button>}

        {/* If comment has comments, show an expand button with the number of nested comments hidden */}
        {el.comments ?
          <button onClick={e => setShowComments(!showComments)} className={`flex gap-1 text-sm items-center justify-center icon-button`}>
            {/* Change icon if nested comments are hidden or not */}
            {showComments ? <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} /> : <FontAwesomeIcon icon={faDownLeftAndUpRightToCenter} />}
            {/* Show number of top level replies */}
            <p className="text-xs">{el.comments.length}</p>
          </button> : <></>}

        {/* If user made this comment, show a delete button */}
        {userData && userData.user && userData.user.username == el.user ?
          // On click, show destructive aciton confirmation
          <button onClick={e => setConfrimDelete(true)} className={`icon-button text-xs flex justify-center items-center gap-2`}>
            <FontAwesomeIcon icon={faTrash} />
            {loading ? <Spinner /> : <></>}
          </button> : <></>}
      </div>

      {/* Show reply input when the reply button is clicked */}
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
          {/* Send button to confirm reply */}
          <button onClick={submitReply} className="icon-button flex items-center justify-center gap-4">
            <FontAwesomeIcon icon={faPaperPlane} />
            {loading ? <Spinner /> : <></>}
          </button>
        </div> : <></>}

      {!showComments || !el.comments ? <></> :
        // If the element has comments and showComments is true, render all nested comments 
        // Give all nested comments a depth and index map to make created/deleting nested comments easier
        el.comments.map((el, i) => {
          const newMap = [...map];
          newMap.push(i)
          return (
            <CommentItem key={`${depth + 1}comment${i}`} depth={props.depth + 1} el={el} recipeId={recipeId} map={newMap} />
          )
        })}

      {/* Destructive action confirmation for deleting the comment */}
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