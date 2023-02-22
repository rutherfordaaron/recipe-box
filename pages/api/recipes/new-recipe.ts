import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../util/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Connect to the "recipes" collection on the database
  const client = await clientPromise;
  const db = client.db(process.env.DB);
  const recipes = db.collection("recipes");
  const recipe = req.headers["recipe"];

  switch (req.method) {
    case "POST":
      if (typeof recipe === "string") {
        const newRecipe = JSON.parse(recipe);
        // Insert new recipe
        const recipeResult = await recipes.insertOne(newRecipe);
        res.status(200).json({ success: true });
      } else {
        // wrong data type
        res.status(500).json({ success: false });
      }
      break;
    default:
      // 405: METHOD NOT ALLOWED
      // No methods other than POST allowed at this endpoint
      res.status(405).redirect("/");
  }
}

export default handler;