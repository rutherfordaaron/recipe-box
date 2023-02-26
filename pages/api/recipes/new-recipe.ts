import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../util/db";
import parseCookie from "../../../util/parseCookie";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Connect to the "recipes" collection on the database
  const client = await clientPromise;
  const db = client.db(process.env.DB);
  const recipe = req.headers["recipe"];

  switch (req.method) {
    case "POST":
      if (typeof recipe === "string") {
        const newRecipe = JSON.parse(recipe);
        const users = db.collection("users");
        const cookie = req.headers.cookie;
        // If no cookies found, 401: Unauthorized
        if (!cookie) {
          res.status(401).json({ success: false, reason: "User authentication failed." });
          break;
        } else {
          // Parse cookie into an object using utility function
          const parsedCookie = parseCookie(cookie);
          // Authenticate user exists from token stored in cookie
          const user = await users.findOne({ token: parsedCookie.token });
          // If recipe owner and authenticated user don't match or user can't be found with token,
          // 401: Unauthorized
          if (user && newRecipe.owner !== user.username || !user) {
            res.status(401).json({ success: false, reason: "User authentication failed." });
            break;
          }
          // Insert new recipe
          const recipes = db.collection("recipes");
          const recipeResult = await recipes.insertOne(newRecipe);
          // If recipe fails to insert, 500: Internal Server Error
          if (!recipeResult) {
            res.status(500).json({ success: false, reason: "Database error. Please try again." })
          }
          res.status(200).json({ success: true });
        }

      } else {
        // If recipe header is somehow not a string, 500: Internal Server Error
        res.status(500).json({ success: false, reason: "Wrong data type was submitted. Please try again." });
      }
      break;
    default:
      // 405: METHOD NOT ALLOWED
      // No methods other than POST allowed at this endpoint
      res.status(405).redirect("/");
  }
}

export default handler;