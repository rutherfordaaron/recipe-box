import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../util/db";
import crypto from "crypto";
import User from "../../../models/user";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Connect to the "users" collection on the database
  const client = await clientPromise;
  const db = client.db(process.env.DB);
  const users = db.collection("users");

  switch (req.method) {
    // Create new user only if using a POST request
    case "POST":
      const username = req.body.user;
      const email = req.body.email;
      const password = req.body.pass;

      // Check to see if user already exists (username or email)
      const userExists = await users.findOne({ username: username });
      if (userExists) {
        // 409: CONFLICT
        res.status(409).redirect("/sign-up?error=Username-already-in-use");
        break;
      }
      const emailExists = await users.findOne({ email: email });
      if (emailExists) {
        // 409: CONFLICT
        res.status(409).redirect("/sign-up?error=Email-already-in-use");
        break;
      }

      // Hash the password for storage on the database
      let hashPassword = crypto.createHash("sha256").update(password).digest("hex");

      // create a user object and post it to the database
      const newUser = new User(username, email, hashPassword, new Date());
      users.insertOne(newUser);

      // 201: CREATED
      res.status(201).redirect("/login");
      break;
    default:
      // 405: METHOD NOT ALLOWED
      // No methods other than POST allowed at this endpoint
      res.status(405).redirect("/");
  }
}

export default handler;