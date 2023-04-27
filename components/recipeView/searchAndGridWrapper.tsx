import { PropsWithChildren } from "react"
import Search from "./search"
import { useState, useEffect, useRef } from "react"
import { Filter, emptyFilter } from "../../util/types"
import RecipeGridPage from "./recipeGridPage"
import { Spinner } from "../spinner"

const SearchAndGridWrapper = (props: PropsWithChildren) => {
  const [filter, setFilter] = useState<Filter>(emptyFilter)
  const [newFilter, setNewFilter] = useState<Filter>(emptyFilter);
  const [endOfData, setEndOfData] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [recipes, setRecipes] = useState<JSX.Element[]>([])

  const gridInnerRef = useRef();

  useEffect(() => {
    let recipePageArr = [];
    for (let i = 0; i <= page; i++) {
      recipePageArr.push(<RecipeGridPage index={i} size={20} filter={filter} setEndOfData={setEndOfData} />)
    }
    setRecipes(recipePageArr);
  }, [page])

  useEffect(() => {
    setPage(0);
    let recipePageArr = [];
    recipePageArr.push(<RecipeGridPage index={0} size={20} filter={filter} setEndOfData={setEndOfData} />)
    setRecipes(recipePageArr);
  }, [newFilter])

  const onScroll = () => {
    if (gridInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = gridInnerRef.current;
      if (scrollTop + clientHeight >= scrollHeight && !endOfData) setPage(page + 1)
    }
  }


  return (
    <div className="md:grid md:grid-cols-[2fr_3fr] lg:grid-cols-[2fr_5fr] gap-4 h-[73vh] md:h-[75vh]">
      <Search setNewFilter={setNewFilter} filter={filter} setFilter={setFilter} />
      <div
        className="flex flex-col md:grid lg:grid-cols-2 items-center gap-4 max-h-[73vh] md:max-h-[75vh] py-4 pr-2 overflow-y-scroll"
        onScroll={onScroll}
        //@ts-ignore
        ref={gridInnerRef}
      >
        {recipes}
        <div className="col-span-2 pt-4 h-[50px] overflow-hidden">
          {endOfData ? <></> : <Spinner />}
        </div>
      </div>
    </div>
  )
}

export default SearchAndGridWrapper