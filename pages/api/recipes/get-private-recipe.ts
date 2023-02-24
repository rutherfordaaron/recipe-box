import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../util/db";
import { ObjectId } from "mongodb";
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Connect to the "recipes" collection on the database
  const client = await clientPromise;
  const db = client.db(process.env.DB);
  const users = db.collection("users");

  // Extract parameters from request headers
  const id = req.headers["id"];
  const user = req.headers["user"];
  const token = req.headers["token"];

  switch (req.method) {
    case "GET":
      if (id && user && token) {
        // verify the user
        const userToValidate = await users.findOne({ username: user });
        if (userToValidate?.token !== token) {
          // If user and token don't matchup, error 401: Unauthorized
          res.status(401).json({ data: 401 });
          break;
        }

        // connect to recipe collection and validate recipe owner
        // Recipe must match the object id and owner provided
        const recipes = db.collection("recipes");
        const recipe = await recipes.findOne({ _id: new ObjectId(String(id)), owner: user });
        if (!recipe) {
          // If object id and owner don't match up, error 401: Unauthorized
          res.status(401).json({ data: 401 });
          break;
        }

        res.status(200).json({ data: recipe });
      } else {
        // If there isn't a token, username, or object id, error 400: bad request
        res.status(400).json({ data: 400 })
      }
      break;
    default:
      // If req method isn't GET, error 405: Method not allowed
      res.status(405).json({ data: 405 });
  }
}

export default handler;