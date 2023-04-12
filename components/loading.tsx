import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-white opacity-80 text-3xl z-[5] flex justify-center items-center">
      <div className="max-w-[40px] mx-auto">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
      </div>
    </div>
  )
}

export default Loading;