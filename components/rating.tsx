export const Rating = (props: { rating: number[] }) => {
  // calculate the rating and round to the neares half;
  let sum = 0;
  for (let i = 0; i < props.rating.length; i++) {
    sum += props.rating[i];
  }
  const ratingToHalf = Math.round((sum / props.rating.length) * 2) / 4;
  const ratingToWhole = Math.round(sum / props.rating.length);

  const getSvg = (fill: boolean, flip: boolean) => <svg
    width="20px"
    height="20px"
    viewBox="0 0 24 24"
    fill="none"
    version="1.1"
    id="svg135"
    className={`${flip ? "-scale-x-100 relative right-5" : ""} ${fill ? "fill-sky-300" : "fill-sky-50"}`}
    xmlns="http://www.w3.org/2000/svg">
    <defs
      id="defs139" />
    <path
      d="m 12,4 c -0.194375,2.5e-6 -0.38875,0.10301 -0.4852,0.30902 L 9.35002,8.93274 4.45559,9.68243 C 4.02435,9.74848 3.84827,10.2758 4.15292,10.5888 l 3.55933,3.6573 -0.83451,5.1288 c -0.07203,0.4427 0.39671,0.7738 0.78827,0.5568 L 12,17.5299"
      stroke="#555"
      stroke-linecap="round"
      stroke-linejoin="round"
      id="path133"
      fillOpacity={1}
      strokeWidth={.5}
      strokeDasharray="none" />
  </svg>

  if (!props.rating[0]) return <></>
  return (
    <div className="flex items-center justify-end gap-2">
      <div className="flex">
        <div className="flex relative left-[110px]">
          {getSvg(ratingToWhole >= 1, false)}
          {getSvg(ratingToWhole >= 2, true)}
        </div>
        <div className="flex relative left-[88px]">
          {getSvg(ratingToWhole >= 3, false)}
          {getSvg(ratingToWhole >= 4, true)}
        </div>
        <div className="flex relative left-[66px]">
          {getSvg(ratingToWhole >= 5, false)}
          {getSvg(ratingToWhole >= 6, true)}
        </div>
        <div className="flex relative left-[44px]">
          {getSvg(ratingToWhole >= 7, false)}
          {getSvg(ratingToWhole >= 8, true)}
        </div>
        <div className="flex relative left-[22px]">
          {getSvg(ratingToWhole >= 9, false)}
          {getSvg(ratingToWhole >= 10, true)}
        </div>
      </div>
      <p className="relative text-sky-400">{ratingToHalf} ({props.rating.length})</p>
    </div>
  )

}