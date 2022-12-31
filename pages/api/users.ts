import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../util/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Connect to the "users" collection on the database
  const client = await clientPromise;
  const db = client.db(process.env.DB);
  const users = db.collection("users");

  if (req.method === 'POST') {
    // Create a new user object from request body info
    const firstName = req.body.first;
    const lastName = req.body.last;
    const username = req.body.user;
    const email = req.body.email;
    const password = req.body.pass;

    const newUser = { firstName: firstName, lastName: lastName, username: username, email: email, password: password };

    // See if email or username is already being used
    const emailCheck = await users.findOne({ email: email });
    const usernameCheck = await users.findOne({ username: username });

    // If not, add user to database and redirect to user list
    if (emailCheck === null && usernameCheck === null) {
      await users.insertOne(newUser);
      res.status(200).redirect(`/user-list?message="User ${username} created successfully"`);
      // Otherwise, redirect back to signup with an error
    } else if (emailCheck !== null) {
      res.status(400).redirect('/sign-up?error="email already in use"');
    } else if (usernameCheck !== null) {
      res.status(400).redirect('/sign-up?error="username already in use"');
    }

  } else if (req.method === "GET") {
    // if (req.query["all"] === "true") {
    //   const allUsersCursor = users.find();
    //   res.status(200).json(allUsersCursor);
    // } else {
    //   const username = req.query["user"];
    // }
    // Retrieve a user
  } else if (req.method === "POST") {
    // update a user
  } else if (req.method === "DELETE") {
    // Remove a user
  } else {

  }
}