import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../util/db";
import getUser from "../../util/getUser";
import { ObjectId } from "mongodb";
import getToken from "../../util/getToken";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Connect to the "recipes" collection on the database
  const client = await clientPromise;
  const db = client.db(process.env.DB);
  const recipes = db.collection("recipes");
  const token = getToken(req);

  switch (req.method) {
    /* -------------------- GET -------------------- */
    // Get a recipe from the database
    case "GET":
      // if id property isn't foud, 400: Bad Request
      const id = req.query.id;
      if (!id) {
        res.status(400).json({ recipe: null, message: "missing data to process request" })
        break;
      }

      // Get recipe from given id parameter from request body
      const recipe = await recipes.findOne({ _id: new ObjectId(String(id)) });

      // if recipe is not found in database, 404: Not Found
      if (!recipe) {
        res.status(404).json({ recipe: null, message: "recipe not found" });
        break;
      }

      // If recipe is not marked as public, verify user before sending back the recipe
      if (!recipe.public) {

        // If token is not provided, 400: Bad Request
        if (!token) {
          res.status(400).json({ reicpe: null, message: "missing authentication token" });
          break;
        }

        // VERIFY THE USER
        const users = db.collection("users");
        const userToValidate = await users.findOne({ token: token });
        // If no user can be found from provided username, 400: Bad Request
        if (!userToValidate) {
          res.status(400).json({ recipe: null, message: "no user found from provided authentication token" });
          break;
        }

        // If recipe owner and user don't match up, 401: unauthorized
        if (recipe.owner !== userToValidate.username) {
          res.status(401).json({ recipe: null, message: "unauthorized" });
          break;
        }

        // If user exists, and the correct token is given, send the recipe
        res.status(200).json({ message: "success", recipe: recipe });
        break;
      }

      // If recipe is marked as public, send it
      res.status(200).json({ message: "success", recipe: recipe });
      break;
    /* -------------------- POST -------------------- */
    // Insert a new recipe into the database
    case "POST":
      // Parse the recipeData from the request header
      const recipeData = req.headers["recipe"];
      if (typeof recipeData === "string") {
        const newRecipe = JSON.parse(recipeData);

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