import Link from "next/link";
import getPublicRecipes from "../util/getPublicRecieps";
import getUser from "../util/getUser";

export default function Home() {

  const { userData } = getUser();

  return (
    <article>
      <h1 className="text-3xl font-bold">Welcome to Recipe Box!</h1>
      <p className="text-xl mb-4">A recipe management app to digitize your cookbook.</p>
      <p className="text-center">Have recipes you want to upload?</p>
      <div className="flex justify-center my-4">
        <Link href="/sign-up" className="bg-sky-300 shadow-lg rounded py-2 px-4 hover:bg-sky-200 transition-all">Get Started</Link>
      </div>
      <p className="text-center">Want to see what it&apos;s all about?</p>
      <div className="flex justify-center my-4">
        <Link href="/public-recipes" className="bg-sky-300 shadow-lg rounded py-2 px-4 hover:bg-sky-200 transition-all">View Public Recipes</Link>
      </div>
      <p className="text-center">Already have an account?</p>
      <div className="flex justify-center my-4">
        <Link href="/login" className="bg-sky-300 shadow-lg rounded py-2 px-4 hover:bg-sky-200 transition-all">Login</Link>
      </div>
    </article>
  )
}