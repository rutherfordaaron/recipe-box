import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../util/db";
import { Filter, Recipe } from "../../util/types";
import { getRecipeFilter } from "../../util/pipelines";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = client.db(process.env.DB);
  const recipes = db.collection("recipes");
  const filter: Filter = JSON.parse(req.query.filter ? req.query.filter.toString() : "");

  switch (req.method) {
    case "GET":
      const filteredPublicRecipes = recipes.aggregate(getRecipeFilter(filter)).toArray();

      if (!filteredPublicRecipes) {
        res.status(404).json({ recipes: null, message: "No public recipes found" });
        break;
      }
      res.status(200).json({ recipes: await filteredPublicRecipes, message: "success" })
      break;
    default:
      res.status(405).json({ recipes: null, message: "Unaccepted request method" });
  }
}

export default handler;