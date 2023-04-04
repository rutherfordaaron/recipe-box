import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getUser from "../util/getUser"
import { Spinner } from "./spinner";
import { faX } from "@fortawesome/free-solid-svg-icons";

export const FilterMenu = (props: { showFilterMenu: boolean, setShowFilterMenu: Function, tagFilter: string[], setTagFilter: Function }) => {
  const { showFilterMenu, setShowFilterMenu, tagFilter, setTagFilter } = props;
  let { userData: data, userError: error, userIsLoading: loading } = getUser();

  const addFilterTag = (value: string) => {
    const activeTags = [...tagFilter];
    activeTags.push(value);
    setTagFilter(activeTags)
  }

  const removeFilterTag = (value: string) => {
    const activeTags = [...tagFilter];
    setTagFilter(activeTags.filter(item => item !== value));
  }

  return (
    <div className={`fixed top-0 bottom-0 right-0 bg-sky-50 z-50 flex flex-col gap-4 w-3/4 md:w-1/2 max-w-[500px] px-4 pt-16 ${showFilterMenu ? "" : "hidden"}`}>
      <button onClick={e => setShowFilterMenu(false)} type="button" className="shadow-none absolute top-5 right-5 ">
        <FontAwesomeIcon icon={faX} />
      </button>
      <p>Filter by tag:</p>
      {loading ? <Spinner /> : error ? <p>Error: {error.message}</p> : data && data.user ?
        <div className="grid grid-cols-2 gap-2 w-full mx-auto">
          {data.user.tags ? data.user.tags.map((el, i) => {
            // Active Tag Filters
            if (tagFilter.find(item => item === el)) return (
              <button
                key={`tagFilter${i}`}
                className={`bg-sky-300 shadow`}
                onClick={e => removeFilterTag(el)}
              >
                {el}
              </button>
            )
            // Inactive Tag Filters
            return (
              <button
                key={`tagFilter${i}`}
                className={`bg-sky-100 shadow`}
                onClick={e => addFilterTag(el)}
              >
                {el}
              </button>
            )
          }) : <></>}
        </div>
        : <></>}
    </div>
  )
}