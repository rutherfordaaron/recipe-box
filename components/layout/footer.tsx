import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const Footer = () => {
  const linkClass = "underline italic"

  return (
    <footer className="p-5 bg-slate-200 mt-4 text-sm">
      <div className="max-w-[1000px] mx-auto flex max-sm:flex-col gap-4 justify-between">
        <ul>
          <li><Link href="/" className={linkClass}>Home</Link></li>
          <li><Link href="/public-recipes" className={linkClass}>Public Recipes</Link></li>
          <li><Link href="/privacy-policy" className={linkClass}>Privacy Policy</Link></li>
          <li><Link href="https://github.com/hazipan/recipe-box" className={linkClass}>See the code <FontAwesomeIcon icon={faExternalLink} className="pl-1" /></Link></li>
        </ul>
        <div>
          <p className="mb-1">The Recipe Box is independantly created by <Link className={linkClass} href="https://aaronrutherford.dev" rel="noreferrer" target="_blank">Aaron Rutherford <FontAwesomeIcon icon={faExternalLink} className="pl-1" /></Link>.</p>
          <p><Link className={linkClass} href="mailto:contact@aaronrutherford.dev">Contact me</Link> for suggestions, reporting bugs, and support help.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;