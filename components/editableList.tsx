import { Reorder } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type Ingredient = { ingredient: string, measurement: string, id: string }

function isIngredient(item: any): item is Ingredient {
  return (item as Ingredient).measurement !== undefined;
}

const EditableList = (props: { list: Ingredient[] | string[], setList: (newOrder: any[]) => void }) => {
  const removeItem = (item: Ingredient | string) => {
    const tempList = [...props.list];
    const newList = tempList.filter(el => el != item);
    props.setList(newList);
  }

  return (
    <Reorder.Group values={props.list} onReorder={props.setList}>
      {props.list.map((item, i) => {
        return (
          <Reorder.Item value={item} as="div" key={isIngredient(item) ? item.id : item} className="flex justify-between gap-3 my-3">
            {isIngredient(item) ? <p>{item.measurement} of {item.ingredient}</p> : <p></p>}
            <FontAwesomeIcon
              icon={faXmark}
              className="hover:cursor-pointer"
              onClick={() => removeItem(item)}
            />
          </Reorder.Item>
        )
      })}
    </Reorder.Group>
  )
}

export default EditableList