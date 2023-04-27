import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../util/db";
import { Filter, Recipe } from "../../util/types";
import { getRecipeFilter } from "../../util/pipelines";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const client = await clientPromise;
  const db = client.db(process.env.DB);
  const recipes = db.collection("recipes");
  const filter: Filter = JSON.parse(req.query.filter ? req.query.filter.toString() : "");
  const size = req.query.size;
  const page = req.query.page;

  switch (req.method) {
    case "GET":
      const matchedCount = (await recipes.aggregate(getRecipeFilter(filter)).toArray()).length
      const filteredPublicRecipes = recipes.aggregate(getRecipeFilter(filter));
      const limitedResults = await filteredPublicRecipes.skip(Number(size) * Number(page)).limit(Number(size)).toArray();

      if (!filteredPublicRecipes) {
        res.status(404).json({ recipes: null, message: "No public recipes found" });
        break;
      }
      res.status(200).json({ recipes: limitedResults, message: "success", matched: matchedCount })
      break;
    default:
      res.status(405).json({ recipes: null, message: "Unaccepted request method" });
  }
}

export default handler;