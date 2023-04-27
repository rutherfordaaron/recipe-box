import { ChangeEventHandler, KeyboardEventHandler } from "react";

const Input = (props: {
  id: string,
  type: "text" | "textarea" | "number" | "password" | "email",
  label: string,
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
  state: any,
  valid: boolean,
  range?: [number, number],
  size?: "small" | "default",
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>
}) => {
  const { id, type, label, onChange, state, valid, range, size } = props;

  if (type === "textarea") return (
    <div className="relative my-4 transition-all mx-auto">
      <label
        htmlFor={id}
        className={`
          absolute left-2  transition-all
          ${!valid && state ? "text-red-400 text-xs -top-[17px]"
            : state ? "text-sky-300 text-xs -top-[17px]"
              : "bottom-0 text-slate-300 top-0"}
        `}
      >
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        onKeyDown={(e) => {
          if (props.type === "number") {
            if (e.key === "Backspace") {
              return
            }
            if (!e.key.match(/^[0-9]+$/)) {
              e.preventDefault()
            }
          }
          if (id === "pass" || id === "confrim-pass") {
            if (!e.key.match(/[a-zA-Z0-9!@#$%^&*()\_+.-]/)) e.preventDefault();
          }
        }}
        onChange={onChange}
        className={`
          border-2 h-[75px] px-1 rounded focus:outline-none focus:border-sky-200 transition-all bg-transparent
          ${!valid && state ? "border-red-400" : state ? "border-sky-400" : "border-slate-300"}
        `}
        value={state}
      />
    </div>
  )

  return (
    <div className="relative my-4 transition-all mx-auto">
      <label
        htmlFor={id}
        className={`
          absolute left-2  transition-all
          ${!valid && state ? "text-red-400 text-xs -top-[15px]"
            : state ? "text-sky-300 text-xs -top-[15px]"
              : "bottom-0 text-slate-300 top-0"}
        `}
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        onKeyDown={(e) => {
          if (props.onKeyDown) props.onKeyDown(e);
          if (type === "number") {
            if (e.key === "Backspace" || e.key === "Tab") {
              return
            }
            if (!e.key.match(/^[0-9]+$/)) {
              e.preventDefault()
            }
          }
          if (id === "pass" || id === "confrim-pass") {
            if (!e.key.match(/[a-zA-Z0-9!@#$%^&*()\_+.-]/)) e.preventDefault();
          }
        }}
        onChange={onChange}
        className={`
          border-b-2 focus:outline-none focus:border-sky-200 transition-all bg-transparent
          ${size === "small" ? "w-[75px]" : ""}
          ${!valid && state ? "border-red-400" : state ? "border-sky-400" : "border-slate-300"}
        `}
        value={state}
        min={range ? range[0] : undefined}
        max={range ? range[1] : undefined}
      />
    </div>
  )
}

export default Input;