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
        res.status(400).json({ recipes: null, message: "no authentication token found" });
        break;
      }

      // Verify user with authentication token
      const users = db.collection("users");
      const user = await users.findOne({ token: token });
      // If no user found from provided username, 401: Unauthorized
      if (!user) {
        res.status(401).json({ recipes: null, message: "no user found" });
        break;
      }

      // If everything looks good, find all user recipes and send back as array
      const recipes = db.collection("recipes");
      const userRecipes = await recipes.find({ owner: user.username }).toArray();
      res.status(200).json({ message: "success", recipes: userRecipes });
      break;
    default:
      // If anyother method other than GET, 405: Method not allowed
      res.status(405).redirect("/");
  }
}

export default handler;