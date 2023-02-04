import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../util/db";
import parseCookie from "../../../util/parseCookie";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "DELETE":
      // Connect to the "users" collection on the database
      const client = await clientPromise;
      const db = client.db(process.env.DB);
      const users = db.collection("users");

      // Extract authorization token from cookies
      const cookie = req.headers.cookie || "";
      const parsedCookies = parseCookie(cookie);
      const token = parsedCookies.token;

      // If the token exists, remove the user from the database and send success: true
      // otherwise, status 401 (UNAUTHORIZED) and send sucess: false
      if (token) {
        const deleted = await users.deleteOne({ token: token });
        if (deleted.deletedCount > 0) {
          res.status(200).json({ success: true });
          break;
        } else {
          res.status(500).json({ success: false });
          break;
        }
      } else {
        res.status(401).json({ sucess: false });
        break;
      }
    default:
      res.status(405).send("METHOD NOT ALLOWED")
  }
}

export default handler;