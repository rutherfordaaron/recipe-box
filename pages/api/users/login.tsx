import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../util/db";
import crypto from "crypto";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Connect to the "users" collection on the database
  const client = await clientPromise;
  const db = client.db(process.env.DB);
  const users = db.collection("users");

  switch (req.method) {
    case "POST":
      // Get the user according to the provided username
      const user = await users.findOne({ username: req.body.username });
      // If the user doesn't exist in the database,
      // return 404 (Not Found) and redirect to /login with error
      if (!user) {
        res.status(404).redirect("/login?error=User-does-not exist");
        break;
      }

      // Get the provided password
      const password = req.body.password;
      // Hash the password for comparison
      let hashPassword = crypto.createHash("sha256").update(password).digest("hex");
      // If the password doesn't match what's on file, 
      // return 400 (bad request) and redirect to /login with error
      if (hashPassword !== user.password) {
        res.status(400).redirect("/login?error=Incorrect-password");
        break;
      }

      res.status(200).redirect("/?Loggedin=true")
      break;
    default:
      // 405: METHOD NOT ALLOWED
      // No methods other than POST allowed at this endpoint
      res.status(405).redirect("/");
  }
}

export default handler;
