import { ChangeEventHandler } from "react";

const RadioButton = (props: {
  id: string,
  name: string,
  label: string,
  onClick: ChangeEventHandler<HTMLInputElement>,
  checked: boolean
}) => {
  return (
    <div>
      <input
        type="radio"
        id={props.id}
        name={props.name}
        value={props.id}
        onChange={props.onClick}
        checked={props.checked}
      />
      <label htmlFor={props.id}>{props.label}</label>
    </div>
  )
}

export default RadioButton;