import { ChangeEventHandler } from "react";

const RadioButton = (props: {
  id: string,
  name: string,
  label: string,
  onClick: ChangeEventHandler<HTMLInputElement>
}) => {
  return (
    <div>
      <input type="radio" id={props.id} name={props.name} value={props.id} onChange={props.onClick} />
      <label htmlFor={props.id}>{props.label}</label>
    </div>
  )
}

export default RadioButton;