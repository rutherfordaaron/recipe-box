import { SortParameter } from "../util/types";

export const SortMenu = (props: { setSort: Function, activeSortParameter: SortParameter, visible: boolean, setVisible: Function }) => {
  const { setSort, activeSortParameter, visible, setVisible } = props;
  const sortArr = [SortParameter.Ascending, SortParameter.Descending, SortParameter.RecentlyCreated, SortParameter.RecentlyUpdated, SortParameter.OldestCreated, SortParameter.OldestUpdated]
  return (
    <div className={`absolute top-14 -left-3 bg-sky-50 ${visible ? "" : "hidden"} shadow-lg rounded overflow-hidden z-40 flex flex-col`}>
      {sortArr.map((el, i) => {
        return (
          <button key={`sortParameter${i}`} onClick={e => {
            setSort(el);
            setVisible(false);
          }} className={`${el == activeSortParameter ? "bg-sky-300" : ""} rounded-none border-b-2 shadow-none border-sky-100`}>
            {el}
          </button>
        )
      })}
    </div>
  )
}