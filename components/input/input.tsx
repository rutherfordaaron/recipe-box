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
    <div className="relative my-4">
      <label
        htmlFor={props.id}
        className={`
          absolute top-0 left-2 text-slate-200 transition-all
          ${!props.valid && props.state ? "text-red-400 border-red-400 text-xs -top-[10px]"
            : props.state ? "border-blue-300 text-blue-300 text-xs -top-[10px]"
              : "bottom-0"}
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
          border-b focus:outline-none focus:border-blue-300 transition-all
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