export const DestructiveAction = (props: { message: string, destroyMessage: string, cancelMessage: string, setVisible: Function, destructiveAction: Function }) => {
  const { message, destroyMessage, cancelMessage, setVisible, destructiveAction } = props;
  return (
    <div className="fixed inset-0 bg-translucent z-[5] flex flex-col justify-center items-center p-12 text-center">
      <p className="text-xl drop-shadow">{message} This <span className="italic">cannot</span> be undone.</p>
      <div className="flex gap-4 mt-4">
        <button className="w-[45%] bg-emerald-100 text-emerald-900 hover:bg-emerald-500 hover:text-black border-none shadow-lg" onClick={e => setVisible(false)}>{cancelMessage}</button>
        <button className="w-[45%] bg-rose-100 text-rose-900 border-none hover:bg-rose-500 hover:text-black shadow-lg" onClick={e => destructiveAction()}>{destroyMessage}</button>
      </div>
    </div>
  )
}