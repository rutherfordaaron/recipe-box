import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../util/db";
import parseCookie from "../../util/parseCookie";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Connect to the "recipes" collection on the database
  const client = await clientPromise;
  const db = client.db(process.env.DB);

  switch (req.method) {
    case "GET":
      // Extract authentication token from cookies
      const cookie = req.headers.cookie || "";
      const parsedCookies = parseCookie(cookie);
      const token = parsedCookies.token;
      // If token is not provided, 400: Bad Request
      if (!token) {
        res.status(400).json({ error: true, data: "no authentication token found" })
      }

      // Extract user name from headers and connect to database users collection
      const user = req.headers["user"];
      const users = db.collection("users");
      // Verify user with username and token
      const userToValidate = await users.findOne({ username: user });
      // If no user found from provided username, 401: Unauthorized
      if (!userToValidate) {
        res.status(401).json({ error: true, data: "no user found" });
        break;
      }

      // If user and token don't match up, 401: Unauthorized
      if (userToValidate.token !== token) {
        res.status(401).json({ error: true, data: "not authorized" });
        break;
      }

      // If everything looks good, find all user recipes and send back as array
      const recipes = db.collection("recipes");
      const userRecipes = await recipes.find({ owner: user }).sort({ name: 1 }).toArray();
      res.status(200).json({ error: false, data: userRecipes });
      break;
    default:
      // If anyother method other than GET, 405: Method not allowed
      res.status(405).redirect("/");
  }
}

export default handler;