import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, faHome } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const NavLink = (props: { icon: IconDefinition, secondaryIcon?: IconDefinition, text: string, href: string }) => {
  const { icon, secondaryIcon, text, href } = props
  return (
    <Link href={href} className="text-center hover:text-sky-800 text-sky-400 transition-all font-bold">
      <div className="relative w-fit mx-auto">
        <FontAwesomeIcon className="text-2xl text-sky-300" icon={icon} />
        {secondaryIcon ? <FontAwesomeIcon icon={secondaryIcon} className="absolute bottom-0 -right-2 text-sky-300" /> : <></>}
      </div>
      <p className="text-xs">{text}</p>
    </Link>
  )
}

export default NavLink;