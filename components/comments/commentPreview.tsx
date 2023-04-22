import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faComment } from "@fortawesome/free-regular-svg-icons"

const CommentPreview = (props: { count: number }) => {
  return (
    <div className="text-sky-300 flex gap-1 items-center">
      <FontAwesomeIcon icon={faComment} className="text-sm" />
      <p>{props.count}</p>
    </div>
  )
}

export default CommentPreview