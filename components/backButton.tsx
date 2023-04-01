import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"

export const BackButton = (props: { href: string }) => {
  return (
    <Link href={props.href}>
      <FontAwesomeIcon icon={faArrowLeft} className="hover:cursor-pointer text-3xl mt-4 hover:scale-105 transition-all text-slate-600" />
    </Link>
  )
}