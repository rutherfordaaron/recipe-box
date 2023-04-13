export const Rating = (props: { ratings: { user: string, rating: number }[] }) => {
  // calculate the rating and round to the neares half;
  let sum = 0;
  for (let i = 0; i < props.ratings.length; i++) {
    sum += props.ratings[i].rating;
  }
  // average
  const ratingAverage = (sum / props.ratings.length);
  // average rating, rounded to nearest interger (1-10) for filling in stars
  const ratingToWhole = Math.round(ratingAverage);
  // average rating, halved (1-5) and rounded to nearest hundredths for display next to stars
  const ratingToHalf = (Math.round(ratingAverage * 2) / 4).toFixed(2);

  const getSvg = (fill: boolean, flip: boolean) => <svg
    width="6"
    height="12"
    viewBox="0 0 0.36 0.72"
    fill="none"
    version="1.1"
    id="svg135"
    className={`${flip ? "-scale-x-100" : ""} ${fill ? "fill-sky-300" : "fill-sky-50"} stroke-sky-500`}
    xmlns="http://www.w3.org/2000/svg">
    <defs
      id="defs139" />
    <path
      d="m 0.47095843,0.22991092 -0.0911284,-0.1946384 c -0.00812,-0.01734424 -0.0327293,-0.01734373 -0.0408495,4.9e-7 L 0.24785298,0.22991092 0.0418193,0.26146952 c -0.01815328,0.002781 -0.02556546,0.0249783 -0.01274105,0.0381542 l 0.14983192,0.15395586 -0.0351292,0.2158997 c -0.003032,0.0186357 0.0166997,0.0325735 0.0331826,0.0234388 L 0.35940525,0.59181284 0.54184728,0.69291805 c 0.0164845,0.009134 0.0362147,-0.004803 0.0331839,-0.0234388 L 0.53990253,0.45357962 0.68973318,0.29962376 c 0.0128224,-0.0131751 0.005409,-0.0353737 -0.0127423,-0.0381542 z"
      strokeLinecap="round"
      strokeLinejoin="round"
      id="path133"
      fillOpacity={1}
      strokeWidth={.05}
      strokeDasharray="none" />
  </svg>

  if (!props.ratings[0]) return <></>
  return (
    <div className="flex items-center justify-end gap-2">
      <div className="flex gap-1">
        <div className="flex">
          {getSvg(ratingToWhole >= 1, false)}
          {getSvg(ratingToWhole >= 2, true)}
        </div>
        <div className="flex">
          {getSvg(ratingToWhole >= 3, false)}
          {getSvg(ratingToWhole >= 4, true)}
        </div>
        <div className="flex">
          {getSvg(ratingToWhole >= 5, false)}
          {getSvg(ratingToWhole >= 6, true)}
        </div>
        <div className="flex">
          {getSvg(ratingToWhole >= 7, false)}
          {getSvg(ratingToWhole >= 8, true)}
        </div>
        <div className="flex">
          {getSvg(ratingToWhole >= 9, false)}
          {getSvg(ratingToWhole >= 10, true)}
        </div>
      </div>
      <p className="text-sky-300 text-sm">{(ratingAverage / 2).toFixed(2)} ({props.ratings.length})</p>
    </div>
  )

}