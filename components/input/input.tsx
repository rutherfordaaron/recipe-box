import styles from "./input.module.scss";
import { ChangeEventHandler } from "react";

const Input = (props: {
  id: string,
  type: string,
  label: string,
  onChange: ChangeEventHandler<HTMLInputElement>,
  state: string
  valid: boolean
}) => {

  return (
    <div className="input-container">
      <label
        htmlFor={props.id}
        className={!props.valid && props.state ? styles.invalidLabel : props.state ? styles.active : ""}
      >
        {props.label}
      </label>
      <input
        required
        type={props.type}
        id={props.id}
        name={props.id}
        onChange={props.onChange}
        className={`${props.state ? styles.activeInput : ""} ${!props.valid ? styles.invalid : ""}`}
        value={props.state}
      />
    </div>
  )
}

export default Input;