import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../util/db";
import crypto from "crypto";
import { User, defaultTags } from "../../util/types";
import parseCookie from "../../util/parseCookie";
import getToken from "../../util/getToken";

/* GET - Gets/authenticates a user by using the provided authentication token (cookie header)
 * POST - Creates a new user and requires a request body containing an email, password, and username field
 * DELETE - Deletes the user permanently. Requires the token that should be sent as a cookie
 */

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Connect to the "users" collection on the database
  const client = await clientPromise;
  const db = client.db(process.env.DB);
  const users = db.collection("users");

  let token = getToken(req);

  switch (req.method) {
    /* -------------------- GET ------------------------ */
    case "GET":
      // If no token, 401: UNAUTHORIZED
      if (!token) {
        res.status(401).json({ user: null, message: "No authentication token found" });
        break;
      }

      // If user can't be found using provided token, 401: UNAUTHORIZED
      let user = await users.findOne({ token: token });
      if (!user) {
        res.status(401).json({ user: null, message: "Cannot authenticate user with provied token" });
        break;
      }

      // If user is found, 200: OK
      res.status(200).json({ user: user, message: "Success" })
      break;
    /* -------------------- POST ------------------------ */
    // Create new user only if using a POST request
    case "POST":
      let username = req.headers.username;
      let password = req.headers.password;
      let email = req.headers.email;

      if (!(username && password && email)) {
        res.status(400).json({ error: true, message: "Missing required data to process request" });
        break;
      }
      // Check to see if user already exists (username or email)
      const userExists = await users.findOne({ username: username });
      if (userExists) {
        // 409: CONFLICT
        res.status(409).json({ error: true, message: "Username already in use" });
        break;
      }
      const emailExists = await users.findOne({ email: email });
      if (emailExists) {
        // 409: CONFLICT
        res.status(409).json({ error: true, message: "Email already in use" });
        break;
      }

      // create a user object and post it to the database
      const newUser: User = { username: username.toString(), email: email.toString(), password: password.toString(), created: new Date(), verified: false, token: "", tags: defaultTags };

      users.insertOne(newUser);

      // 201: CREATED
      res.status(201).json({ error: false, message: "success" });
      break;
    /* -------------------- DELETE ------------------------ */
    case "DELETE":

      // If the token exists
      if (token) {
        const user = await users.findOne({ token: token });
        if (!user) {
          res.status(500).json({ data: { error: true }, message: "user not found" })
          break;
        }

        const deleted = await users.deleteOne({ _id: user._id });
        if (deleted.deletedCount > 0) {
          // If the user has been deleted, delete all owned recipes and send back status 200
          const recipes = db.collection("recipes");
          recipes.deleteMany({ owner: user.username });
          res.status(200).json({ data: { success: true }, message: "user succesfully deleted" });
          break;
        } else {
          // If nothing was deleted, status 500: Internal server error
          res.status(500).json({ data: { success: false }, message: "something went wrong while deleting the user" });
          break;
        }
      } else {
        // If no token is found, error 401: Unauthorized
        res.status(401).json({ data: { sucess: false }, message: "no authentication token found" });
        break;
      }
    default:
      // 405: METHOD NOT ALLOWED
      res.status(405).redirect("/");
  }
}

export default handler;