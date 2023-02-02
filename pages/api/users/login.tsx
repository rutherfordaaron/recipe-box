import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../util/db";
import jwt from "jsonwebtoken";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Connect to the "users" collection on the database
  const client = await clientPromise;
  const db = client.db(process.env.DB);
  const users = db.collection("users");
  const userData = req.headers["user-data"];

  let username = "";
  let password = "";

  if (typeof userData === "string") {
    username = JSON.parse(userData).username;
    password = JSON.parse(userData).password;
  }

  switch (req.method) {
    case "GET":
      // Get the user according to the provided username
      const user = await users.findOne({ username: username });
      // If the user doesn't exist in the database,
      // return 401 (unauthorized) and redirect to /login with error
      if (user === null) {
        res.status(401).json({ error: "User does not exist" })
        break;
      }

      // Password is hashed on the client side so no need to do that here.

      // If the password doesn't match what's on file, 
      // return 401 (unauthorized) and redirect to /login with error
      if (password !== user.password) {
        res.status(401).json({ error: "Password is incorrect" })

        break;
      }

      // create JWT
      const secret = process.env.SECRET;
      const token = jwt.sign({ user: user.username }, secret, { expiresIn: "1h" });

      // Attach the token to the user in the database
      users.updateOne({ username: username }, { $set: { token: token } });

      // Send token to client to be stored in a cookie
      res.status(200).json({ token: token });
      break;
    default:
      // 405: METHOD NOT ALLOWED
      // No methods other than POST allowed at this endpoint
      res.status(405).redirect("/");
  }
}

export default handler;
