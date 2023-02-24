import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../util/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Connect to the "recipes" collection on the database
  const client = await clientPromise;
  const db = client.db(process.env.DB);
  const recipes = db.collection("recipes");
  const user = req.headers["user"];

  switch (req.method) {
    case "GET":
      const userRecipes = await recipes.find({ owner: user }).sort({ name: 1 }).toArray();
      res.status(200).json({ data: userRecipes });
      break;
    default:
      res.status(405).redirect("/");
  }
}

export default handler;