import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className="text-3xl font-bold">Welcome to Recipe Box!</h1>
      <div className="flex gap-4">
        <Link href="/login" className="bg-sky-300 shadow-lg rounded py-2 px-4 hover:bg-sky-200 transition-all">Login</Link>
        <Link href="/sign-up" className="bg-sky-300 shadow-lg rounded py-2 px-4 hover:bg-sky-200 transition-all">Signup</Link>
      </div>
    </>
  )
}