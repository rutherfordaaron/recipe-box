import { PropsWithChildren } from "react"
import Search from "./search"
import { Spinner } from "../spinner"
import { RecipeGrid } from "./recipeGrid"
import { useState, useEffect } from "react"
import { Filter, emptyFilter } from "../../util/types"
import { useRouter } from "next/router"
import getRecipes from "../../util/getRecipes"

const SearchAndGridWrapper = (props: PropsWithChildren) => {
  const [filter, setFilter] = useState<Filter>(emptyFilter)
  const [newFilter, setNewFilter] = useState<Filter>(emptyFilter);

  const router = useRouter();
  const { data, error, isLoading } = getRecipes(newFilter, /public/.test(router.pathname));

  if (error) return <p>Something went wrong! {error.message}</p>

  return (
    <div className="md:grid md:grid-cols-[2fr_3fr] lg:grid-cols-[2fr_5fr] gap-4 h-[73vh] md:h-[75vh]">
      <Search setNewFilter={setNewFilter} filter={filter} setFilter={setFilter} />
      {isLoading ?
        <Spinner /> :
        <RecipeGrid recipes={data && data.recipes ? data.recipes : []} isLoading={isLoading} />
      }
    </div>
  )
}

export default SearchAndGridWrapper