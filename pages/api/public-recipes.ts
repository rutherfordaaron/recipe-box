import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../util/db";
import { Recipe } from "../../util/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = client.db(process.env.DB);
  const recipes = db.collection("recipes");

  switch (req.method) {
    case "GET":
      const publicRecipes = recipes.find({ public: true }).toArray();
      if (!publicRecipes) {
        res.status(404).json({ recipes: null, message: "No public recipes found" });
        break;
      }
      res.status(200).json({ recipes: await publicRecipes, message: "success" })
      break;
    default:
      res.status(405).json({ recipes: null, message: "Unaccepted request method" });
  }
}

export default handler;