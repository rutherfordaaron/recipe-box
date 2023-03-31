import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/free-solid-svg-icons"

export const Spinner = () => {
  return (
    <div className="animate-spin flex justify-center items-center">
      <FontAwesomeIcon icon={faSpinner} />
    </div>
  )
}