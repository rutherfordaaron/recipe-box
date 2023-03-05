import { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "../../../util/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Connect to the "recipes" collection on the database
  const client = await clientPromise;
  const db = client.db(process.env.DB);
  const users = db.collection("users");

  // Extract parameters from request headers
  const user = req.headers["user"];
  const token = req.headers["token"];

  switch (req.method) {
    case "GET":
      // if the user and token are present, verify the user
      if (user && token) {
        const userToValidate = await users.findOne({ username: user });

        // If user doesn't exist, error 401: Unauthorized
        if (!userToValidate) {
          res.status(401).json({ error: true, data: "user does not exist" });
          break;
        }

        // If user and token don't matchup, error 401: Unauthorized
        if (userToValidate.token !== token) {
          res.status(401).json({ error: true, data: "not authorized" });
          break;
        }

        // If user matches token, authorize them
        res.status(200).json({ error: false, data: "authorized" })
      } else {
        // If there isn't a token or username, error 400: Bad Request
        res.status(400).json({ error: true, data: "bad request" })
      }
      break;
    default:
      // If req method isn't GET, error 405: Method not Allowed
      res.status(405).json({ error: true, data: "method not allowed" });
  }
}

export default handler