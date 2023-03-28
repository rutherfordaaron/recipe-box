import { ChangeEventHandler } from "react";

const Input = (props: {
  id: string,
  type: string,
  label: string,
  onChange: ChangeEventHandler<HTMLInputElement>,
  state: any,
  valid: boolean,
  range?: [number, number]
}) => {

  return (
    <div className="relative my-4 transition-all mx-auto">
      <label
        htmlFor={props.id}
        className={`
          absolute left-2  transition-all
          ${!props.valid && props.state ? "text-red-400 text-xs -top-[15px]"
            : props.state ? "text-blue-300 text-xs -top-[15px]"
              : "bottom-0 text-slate-200 top-0"}
        `}
      >
        {props.label}
      </label>
      <input
        required
        type={props.type}
        id={props.id}
        name={props.id}
        onChange={props.onChange}
        className={`
          border-b-2 focus:outline-none focus:border-blue-200 transition-all
          ${!props.valid && props.state ? "border-red-400" : props.state ? "border-blue-400" : ""}
        `}
        value={props.state}
        min={props.range ? props.range[0] : undefined}
        max={props.range ? props.range[1] : undefined}
      />
    </div>
  )
}

export default Input;