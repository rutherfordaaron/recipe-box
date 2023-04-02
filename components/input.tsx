import { ChangeEventHandler } from "react";

const Input = (props: {
  id: string,
  type: string,
  label: string,
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
  state: any,
  valid: boolean,
  range?: [number, number]
}) => {

  if (props.type === "textarea") return (
    <div className="relative my-4 transition-all mx-auto">
      <label
        htmlFor={props.id}
        className={`
          absolute left-2  transition-all
          ${!props.valid && props.state ? "text-red-400 text-xs -top-[17px]"
            : props.state ? "text-blue-300 text-xs -top-[17px]"
              : "bottom-0 text-slate-300 top-0"}
        `}
      >
        {props.label}
      </label>
      <textarea
        id={props.id}
        name={props.id}
        onKeyDown={(e) => {
          if (props.type === "number") {
            if (e.key === "Backspace") {
              return
            }
            if (!e.key.match(/^[0-9]+$/)) {
              e.preventDefault()
            }
          }
          if (props.id === "pass" || props.id === "confrim-pass") {
            if (!e.key.match(/[a-zA-Z0-9!@#$%^&*()\_+.-]/)) e.preventDefault();
          }
        }}
        onChange={props.onChange}
        className={`
          border-2 h-[75px] rounded focus:outline-none focus:border-blue-200 transition-all bg-transparent
          ${!props.valid && props.state ? "border-red-400" : props.state ? "border-blue-400" : "border-slate-300"}
        `}
        value={props.state}
      />
    </div>
  )

  return (
    <div className="relative my-4 transition-all mx-auto">
      <label
        htmlFor={props.id}
        className={`
          absolute left-2  transition-all
          ${!props.valid && props.state ? "text-red-400 text-xs -top-[15px]"
            : props.state ? "text-blue-300 text-xs -top-[15px]"
              : "bottom-0 text-slate-300 top-0"}
        `}
      >
        {props.label}
      </label>
      <input
        type={props.type}
        id={props.id}
        name={props.id}
        onKeyDown={(e) => {
          if (props.type === "number") {
            if (e.key === "Backspace" || e.key === "Tab") {
              return
            }
            if (!e.key.match(/^[0-9]+$/)) {
              e.preventDefault()
            }
          }
          if (props.id === "pass" || props.id === "confrim-pass") {
            if (!e.key.match(/[a-zA-Z0-9!@#$%^&*()\_+.-]/)) e.preventDefault();
          }
        }}
        onChange={props.onChange}
        className={`
          border-b-2 focus:outline-none focus:border-blue-200 transition-all bg-transparent
          ${!props.valid && props.state ? "border-red-400" : props.state ? "border-blue-400" : "border-slate-300"}
        `}
        value={props.state}
        min={props.range ? props.range[0] : undefined}
        max={props.range ? props.range[1] : undefined}
      />
    </div>
  )
}

export default Input;