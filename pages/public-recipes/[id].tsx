import { useRouter } from "next/router";
import Loading from "../../components/loading";
import getRecipe from "../../util/getRecipe";
import getUser from "../../util/getUser";
import { BackButton } from "../../components/recipeView/recipeDetails/backButton";
import { useState } from "react";
import MessageBanner from "../../components/layout/messageBanner";
import RatingInput from "../../components/recipeView/recipeDetails/ratingInput";
import Comments from "../../components/comments/comments";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart, faStar } from "@fortawesome/free-regular-svg-icons";
import Input from "../../components/input";
import { Spinner } from "../../components/spinner";
import { useSWRConfig } from "swr";
import RecipeHead from "../../components/recipeView/recipeDetails/recipeHead";
import IngredientsAndDirections from "../../components/recipeView/recipeDetails/ingredientsAndDirections";

const PublicRecipeDetails = () => {
  const [newComment, setNewComment] = useState("");
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [showRatingInput, setShowRatingInput] = useState(false);
  const [error, setError] = useState("")
  const [ok, setOk] = useState(false);
  const [newRating, setNewRating] = useState(0);

  const { mutate } = useSWRConfig();

  const router = useRouter();
  const id = router.query.id ? router.query.id.toString() : "";

  let { recipeData, recipeError, recipeIsLoading } = getRecipe(id);
  let { userData, userError, userIsLoading } = getUser();

  if (recipeIsLoading || userIsLoading) return <Loading />
  if (recipeError) return <p>Something went wrong!  {recipeError.message}</p>
  if (userError) return <p>Soemthing went wrong! {userError.message}</p>
  if (recipeData && !recipeData.recipe) return <p>Something went wrong! Looks like this recipe is private. The owner of this recipe will need to mark it as public in order for you to access it.</p>
  if (recipeData && recipeData.recipe) {
    const recipe = recipeData.recipe;

    const startComment = () => {
      setShowRatingInput(false);
      if (!(userData && userData.user)) {
        setOk(false);
        setError("Please log in to comment on recipes")
      } else {
        setShowCommentInput(true);
      }
    }

    const submitNewComment = () => {
      setCommentLoading(true);
      const comment = newComment.trim();
      if (comment) {
        fetch("/api/comment", {
          method: "POST",
          headers:
          {
            "depth": "0",
            "recipe-id": id,
            "user": userData && userData.user ? userData.user.username : "",
            "new-comment": comment,
            "index-map": JSON.stringify([recipe.comments ? recipe.comments.length : 0])
          }
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setError(data.message);
              setOk(true);
              mutate(`/api/recipe?id=${id}`)
            } else {
              setOk(false);
              setError(data.message);
            }
            setCommentLoading(false);
            setNewComment("");
            setShowCommentInput(false);
          })
          .catch((err: Error) => {
            setError(err.message)
            setCommentLoading(false);
            setNewComment("");
            setShowCommentInput(false);
          })
      } else {
        setError("Please fill out comment input")
      }
    }

    const rateRecipe = () => {
      setShowCommentInput(false);
      if (!(userData && userData.user)) {
        setOk(false);
        setError("Please log in to rate recipes")
      } else if (userData.user.username === recipe.owner) {
        setError("You cannot rate your own recipe from here")
        setOk(false);
      } else {
        setShowRatingInput(true);
      }
    }

    const addRating = () => {
      setShowRatingInput(false);
      if (!(userData && userData.user)) {
        setError("Please log in to rate recipes");
        setOk(false);
      } else {
        fetch("/api/addRating", { method: "POST", headers: { "recipe-id": String(recipe._id), "new-rating": newRating.toString(), "user": userData?.user?.username } })
          .then(res => res.json())
          .then(data => {
            if (!data.success) {
              setError(data.message);
              setOk(false);
            } else {
              setError(data.message)
              setOk(true)
            }
          })
      }
    }

    return (
      <article>
        <div className="max-w-[800px] mx-auto">
          <BackButton href="/public-recipes" />
          <RecipeHead recipe={recipe} />
          <IngredientsAndDirections recipe={recipe} />

          {/* Rate, Comment, and Like buttons */}
          <div className="flex justify-center items-center gap-6 text-[24px] my-12">
            <button type="button" onClick={rateRecipe} className="icon-button"><FontAwesomeIcon icon={faStar} /></button>
            <button type="button" onClick={startComment} className="icon-button"><FontAwesomeIcon icon={faComment} /></button>
            {/* <button className="shadow-none hover:bg-transparent hover:text-sky-600"><FontAwesomeIcon icon={faHeart} /></button> */}
          </div>

          {/* Comment input */}
          {showCommentInput ?
            <div className="flex justify-center items-center flex-col relative bottom-10">
              <Input id="comment" type="textarea" label="Your Comment" onChange={e => setNewComment(e.target.value)} state={newComment} valid={Boolean(newComment)} />
              <button disabled={!newComment} type="button" className="bg-sky-200 shadow-lg text-lg px-5 py-2 hover:bg-sky-400 transition-all mt-2 flex justify-center items-center gap-4 disabled:bg-sky-100 disabled:text-sky-200 disabled:shadow-none" onClick={submitNewComment}>
                Submit
                {commentLoading ? <Spinner /> : <></>}
              </button>
            </div> : <></>}

          {/* Rating input */}
          {showRatingInput ?
            <div>
              <RatingInput rating={newRating} setRating={setNewRating} />
              <button className="block mx-auto bg-sky-200 shadow-lg py-2 px-4 hover:bg-sky-400 transition-all mt-6" type="button" onClick={addRating}>Confrim</button>
            </div> : <></>
          }

          {/* Comments */}
          <Comments comments={recipe.comments ? recipe.comments : []} recipeId={id} />
        </div>

        <MessageBanner message={error} ok={ok} />
      </article>
    )
  }
}

export default PublicRecipeDetails