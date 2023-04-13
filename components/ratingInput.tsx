import { useEffect, useState } from "react";

const RatingInput = (props: { rating: number, setRating: Function }) => {
  useEffect(() => {
    const svgs = document.getElementsByClassName("svg");
    for (let i = 0; i < svgs.length; i++) {
      const valueArr = svgs[i].id.match(/[0-9]/g);
      let valueStr = "0";
      if (valueArr) {
        for (let i = 0; i < valueArr.length; i++) {
          valueStr += valueArr[i]
        }
      }

      svgs[i].addEventListener("mouseover", () => setRatingPreview(Number(valueStr)))
      svgs[i].addEventListener("click", () => props.setRating(Number(valueStr)))
    }
    document.getElementById("ratingInputWrapper")?.addEventListener("mouseout", () => { setRatingPreview(0) })
  }, [])

  const [ratingPreview, setRatingPreview] = useState(0);
  const getSvg = (fill: boolean, flip: boolean, value: number) => <svg
    width="12"
    height="24"
    viewBox="0 0 0.36 0.72"
    fill="none"
    version="1.1"
    id={`rating${value}`}
    className={`svg ${flip ? "-scale-x-100" : ""} ${fill ? "fill-sky-300" : "fill-sky-50"} transition-all`}
    xmlns="http://www.w3.org/2000/svg">
    <defs
      id="defs139" />
    <path
      d="m 0.47095843,0.22991092 -0.0911284,-0.1946384 c -0.00812,-0.01734424 -0.0327293,-0.01734373 -0.0408495,4.9e-7 L 0.24785298,0.22991092 0.0418193,0.26146952 c -0.01815328,0.002781 -0.02556546,0.0249783 -0.01274105,0.0381542 l 0.14983192,0.15395586 -0.0351292,0.2158997 c -0.003032,0.0186357 0.0166997,0.0325735 0.0331826,0.0234388 L 0.35940525,0.59181284 0.54184728,0.69291805 c 0.0164845,0.009134 0.0362147,-0.004803 0.0331839,-0.0234388 L 0.53990253,0.45357962 0.68973318,0.29962376 c 0.0128224,-0.0131751 0.005409,-0.0353737 -0.0127423,-0.0381542 z"
      stroke="#aaa"
      strokeLinecap="round"
      strokeLinejoin="round"
      id="path133"
      fillOpacity={1}
      strokeWidth={.05}
      strokeDasharray="none" />
  </svg>

  return (
    <div className="flex items-center justify-center gap-1 my-4" id="ratingInputWrapper">
      <div className="flex">
        {getSvg(ratingPreview >= 1 || props.rating >= 1, false, 1)}
        {getSvg(ratingPreview >= 2 || props.rating >= 2, true, 2)}
      </div>
      <div className="flex">
        {getSvg(ratingPreview >= 3 || props.rating >= 3, false, 3)}
        {getSvg(ratingPreview >= 4 || props.rating >= 4, true, 4)}
      </div>
      <div className="flex">
        {getSvg(ratingPreview >= 5 || props.rating >= 5, false, 5)}
        {getSvg(ratingPreview >= 6 || props.rating >= 6, true, 6)}
      </div>
      <div className="flex">
        {getSvg(ratingPreview >= 7 || props.rating >= 7, false, 7)}
        {getSvg(ratingPreview >= 8 || props.rating >= 8, true, 8)}
      </div>
      <div className="flex">
        {getSvg(ratingPreview >= 9 || props.rating >= 9, false, 9)}
        {getSvg(ratingPreview >= 10 || props.rating >= 10, true, 10)}
      </div>
    </div>
  )
}

export default RatingInput;