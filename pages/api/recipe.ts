import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../util/db";
import getUser from "../../util/getUser";
import { ObjectId } from "mongodb";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Connect to the "recipes" collection on the database
  const client = await clientPromise;
  const db = client.db(process.env.DB);
  const recipes = db.collection("recipes");

  switch (req.method) {
    /* -------------------- GET -------------------- */
    // Get a recipe from the database
    case "GET":
      // if id header isn't foud, 400: Bad Request
      const id = req.headers["id"];
      if (!id) {
        res.status(400).json({ error: true, data: "missing data to process request" })
        break;
      }

      // Get recipe from given id parameter from request headers
      const recipe = await recipes.findOne({ _id: new ObjectId(String(id)) });

      // if recipe is not found in database, 404: Not Found
      if (!recipe) {
        res.status(404).json({ error: true, data: "item not found" });
        break;
      }

      // If recipe is not marked as public, verify user before sending back the recipe
      // Will reqire a username and token be provided
      if (!recipe.public) {
        const user = req.headers["user"];
        const token = req.headers["token"];

        // If either user or token header is not provided, 400: Bad Request
        if (!user || !token) {
          res.status(400).json({ error: true, data: "missing data to process request" });
          break;
        }

        // VERIFY THE USER
        const users = db.collection("users");
        const userToValidate = await users.findOne({ username: user });
        // If no use can be found from provided username, 400: Bad Request
        if (!userToValidate) {
          res.status(400).json({ error: true, data: "no user found" });
          break;
        }

        // If user database token and provided token don't match, 401: Unauthorized
        if (userToValidate.token !== token) {
          res.status(401).json({ error: true, data: "unauthorized" });
          break;
        }

        // If recipe owner and user don't match up, 401: unauthorized
        if (recipe.owner !== userToValidate.username) {
          res.status(401).json({ error: true, data: "unauthorized" });
          break;
        }

        // If user exists, and the correct token is given, send the recipe
        console.log(recipe);
        res.status(200).json({ error: false, data: recipe });
        break;
      }

      // If recipe is marked as public, send it
      res.status(200).json({ error: false, data: recipe });
      break;
    /* -------------------- POST -------------------- */
    // Insert a new recipe into the database
    case "POST":
      // Parse the recipeData from the request header
      const recipeData = req.headers["recipe"];
      if (typeof recipeData === "string") {
        const newRecipe = JSON.parse(recipeData);

        const userData = await getUser({ req: req });
        if (userData.hasOwnProperty("redirect")) {
          res.status(401).json({ error: true, data: "unauthorized" });
          break;
        }

        // Insert new recipe
        const recipes = db.collection("recipes");
        const recipeResult = await recipes.insertOne(newRecipe);
        // If recipe fails to insert, 500: Internal Server Error
        if (!recipeResult.insertedId) {
          res.status(500).json({ error: true, reason: "database error" })
        }
        // If recipe inserts successfully, 200!!
        res.status(200).json({ error: false });
      } else {
        // If recipe header is somehow not a string, 500: Internal Server Error
        res.status(500).json({ error: true, reason: "wrong data type was submitted" });
      }
      break;
    default:
      // If req method isn't GET, error 405: Method not allowed
      res.status(405).json({ data: 405 });
  }
}

export default handler;