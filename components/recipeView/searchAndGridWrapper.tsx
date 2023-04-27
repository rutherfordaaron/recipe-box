import { PropsWithChildren } from "react"
import Search from "./search"
import { Spinner } from "../spinner"
import { useState, useEffect } from "react"
import { Filter, emptyFilter } from "../../util/types"
import RecipeGridPage from "./recipeGridPage"

const SearchAndGridWrapper = (props: PropsWithChildren) => {
  const [filter, setFilter] = useState<Filter>(emptyFilter)
  const [newFilter, setNewFilter] = useState<Filter>(emptyFilter);
  const [endOfData, setEndOfData] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [recipes, setRecipes] = useState<JSX.Element[]>([])

  useEffect(() => {
    let recipePageArr = [];
    for (let i = 0; i <= page; i++) {
      recipePageArr.push(<RecipeGridPage index={i} size={4} filter={filter} />)
    }
    setRecipes(recipePageArr);
  }, [page])

  useEffect(() => {
    setPage(0);
    let recipePageArr = [];
    recipePageArr.push(<RecipeGridPage index={0} size={4} filter={filter} />)
    setRecipes(recipePageArr);
  }, [newFilter])


  return (
    <div className="md:grid md:grid-cols-[2fr_3fr] lg:grid-cols-[2fr_5fr] gap-4 h-[73vh] md:h-[75vh]">
      <Search setNewFilter={setNewFilter} filter={filter} setFilter={setFilter} />
      <div
        className="flex flex-col md:grid lg:grid-cols-2 items-center gap-4 max-h-[73vh] md:max-h-[75vh] py-4 pr-2 overflow-y-scroll"
      >
        {recipes}
        {/* <div className="col-span-2 py-8">
        {endOfData ? <></> : <Spinner />}
      </div> */}
        <button className="col-span-2 block w-[200px] mx-auto" onClick={e => setPage(page + 1)}>Show More</button>
      </div>
    </div>
  )
}

export default SearchAndGridWrapper