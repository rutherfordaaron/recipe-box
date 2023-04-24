import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faComment } from "@fortawesome/free-regular-svg-icons"

// A small comment icon with a count next to it to show how many comments exist
const CommentPreview = (props: { count: number }) => {
  return (
    <div className="text-sky-300 flex gap-1 items-center">
      <FontAwesomeIcon icon={faComment} className="text-sm" />
      <p>{props.count}</p>
    </div>
  )
}

export default CommentPreview