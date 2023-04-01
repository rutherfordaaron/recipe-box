import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-white opacity-80 text-3xl z-[5] flex justify-center items-center">
      <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
    </div>
  )
}

export default Loading;