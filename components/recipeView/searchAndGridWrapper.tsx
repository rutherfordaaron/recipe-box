import { PropsWithChildren } from "react"

const SearchAndGridWrapper = (props: PropsWithChildren) => {
  return (
    <div className="md:grid md:grid-cols-[2fr_3fr] lg:grid-cols-[2fr_4fr] gap-4">
      {props.children}
    </div>
  )
}

export default SearchAndGridWrapper