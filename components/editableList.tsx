import { Reorder } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export type Ingredient = { ingredient: string, measurement: string, id: string }

export function isIngredient(item: any): item is Ingredient {
  return (item as Ingredient).measurement !== undefined;
}

const EditableList = (props: { list: Ingredient[] | string[], setList: (newOrder: any[]) => void }) => {
  const removeItem = (item: Ingredient | string) => {
    const tempList = [...props.list];
    const newList = tempList.filter(el => el != item);
    props.setList(newList);
  }

  return (
    <Reorder.Group values={props.list} as="ol" onReorder={props.setList} className="w-[80%]">
      <p className="text-xs text-slate-300 text-center">Drag and drop items to reorder</p>
      {props.list.map((item, i) => {
        return (
          <Reorder.Item value={item} as="div" key={isIngredient(item) ? item.id : item} className="flex justify-between items-center gap-3 my-3 hover:cursor-grab">
            {isIngredient(item) ? <p>{item.measurement} {/[a-zA-Z]/.test(item.measurement) ? "of " : ""}{item.ingredient}</p> : <li>{item}</li>}
            <FontAwesomeIcon
              icon={faXmark}
              className="hover:cursor-pointer hover:scale-110 transition-all"
              onClick={() => removeItem(item)}
            />
          </Reorder.Item>
        )
      })}
    </Reorder.Group>
  )
}

export default EditableList