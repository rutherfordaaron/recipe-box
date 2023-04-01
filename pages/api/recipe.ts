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
  const users = db.collection("users")
  const token = getToken(req);
  const id = req.query.id;

  switch (req.method) {
    /* -------------------- GET -------------------- */
    // Get a recipe from the database
    case "GET":
      // if id property isn't foud, 400: Bad Request
      if (!id) {
        res.status(400).json({ recipe: null, message: "no recipe id provided" })
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
          res.status(500).json({ error: true, message: "database error" })
        }
        // If recipe inserts successfully, 200!!
        res.status(200).json({ error: false, message: "success" });
      } else {
        // If recipe header is somehow not a string, 500: Internal Server Error
        res.status(500).json({ error: true, message: "wrong data type was submitted" });
      }
      break;
    /* -------------------- DELETE -------------------- */
    // Remove recipe from database
    case "DELETE":
      // If no id provided, 400: BAD REQUEST
      if (!id) {
        res.status(400).json({ error: true, message: "no recipe id provided" });
        break;
      }
      // convert provided id into objectId data type
      const deleteId = new ObjectId(id.toString())
      // if no authentication token provided, 401: UNAUTHORIZED
      if (!token) {
        res.status(401).json({ error: true, message: "no authentication token provided" })
        break;
      }
      // look to see if recipe exists in the database
      const recipeToVerfiy = await recipes.findOne({ _id: deleteId });
      // If it doesn't, 404: NOT FOUND
      if (!recipeToVerfiy) {
        res.status(404).json({ error: true, message: "no recipe found with provided id" })
        break;
      }

      // connect ot users database and check to see if owner of recipe and owner of token match up
      const username = recipeToVerfiy.owner;
      const userToVerify = users.findOne({ username: username, token: token });
      // if not, 401: UNAUTORIZED
      if (!userToVerify) {
        res.status(401).json({ error: true, message: "this recipe is not owned by you" })
        break;
      }
      // delete the recipe
      const result = await recipes.deleteOne({ _id: deleteId });
      // If it for some reason doesn't get deleted (we already verified that it exists), 500: INTERNAL ERROR
      if (!(result.deletedCount > 0)) {
        res.status(500).json({ error: true, message: "internal error, recipe not deleted" })
        break;
      }
      // if deleteion is successful, 200: OK
      res.status(200).json({ error: false, message: "success" })
      break;
    /* -------------------- PATCH -------------------- */
    // Update recipe
    case "PATCH":
      // Check if update data was sent via headers. Otherwise, 400: BAD REQUEST
      const updateData = JSON.parse(req.headers.recipe ? req.headers.recipe.toString() : "");
      if (!updateData) {
        res.status(400).json({ error: true, message: "missing update data" });
        break;
      }

      // Verify that user owns recipe. Otherwise, 400: UNAUTHORIZED
      const ownsRecipe = users.find({ username: updateData.owner, token: token });
      if (!ownsRecipe) {
        res.status(401).json({ error: true, message: "unauthorized" });
        break;
      }

      const idToUpdate = updateData._id;
      delete updateData._id

      const updateResult = await recipes.updateOne({ _id: new ObjectId(idToUpdate) }, { $set: updateData });
      console.log(updateResult);
      if (!updateResult.matchedCount) {
        res.status(500).json({ error: true, message: "failed to update" });
        break;
      }

      res.status(200).json({ error: false, message: "success" });
      break;
    default:
      // Any other method, error 405: Method not allowed
      res.status(405).json({ data: 405 });
  }
}

export default handler;