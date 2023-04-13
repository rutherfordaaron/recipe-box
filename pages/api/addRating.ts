import { NextApiRequest, NextApiResponse } from "next";
import { Recipe } from "../../util/types";
import clientPromise from "../../util/db";
import { ObjectId } from "mongodb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = client.db(process.env.DB);
  const recipes = db.collection("recipes");
  const recipeId = req.headers["recipe-id"];
  const user = req.headers["user"];
  const newRating = req.headers["new-rating"];

  switch (req.method) {
    case "POST":
      if (!(recipeId && user && newRating)) {
        res.status(401).json({ success: false, message: "Missing data to complete request" });
        break;
      }

      const recipe = await recipes.findOne({ _id: new ObjectId(recipeId.toString()) });
      if (!recipe) {
        res.status(404).json({ success: false, message: "Could not find recipe from given ID" });
        break;
      }

      const index = recipe.ratings.findIndex((el: { user: string, rating: number }) => el.user === user);
      if (index == -1) {
        recipe.ratings.push({ user: user, rating: +newRating });
      } else {
        recipe.ratings[index].rating = +newRating;
      }

      console.log(recipe.ratings);

      const updateResult = await recipes.updateOne({ _id: new ObjectId(recipeId.toString()) }, { "$set": { ratings: recipe.ratings } })

      if (updateResult.matchedCount > 0) {
        res.status(200).json({ success: true, message: "Rating updated" });
        break;
      } else {
        res.status(500).json({ success: false, message: "Something went wrong. Please try again" })
      }

      break;
    default:
      res.status(401).json({ success: false, message: "Bad request method" })
  }
}

export default handler;