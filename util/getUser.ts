import { GetServerSidePropsContext } from "next/types";
import clientPromise from "./db";
import parseCookie from "./parseCookie";

const getUser = async (context: GetServerSidePropsContext) => {
  const cookie = context.req.headers.cookie;
  // Ensure there is a cookie header
  if (cookie) {
    // Parse the cookie as an object
    const parsedCookie = parseCookie(cookie);
    // If there is no value for "token" in the cookie, redirect to the login page
    if (!parsedCookie.token) {
      return null;
    }

    const token = parsedCookie.token;

    // Connect to the database, users collection
    const client = await clientPromise;
    const db = client.db(process.env.DB);
    const users = db.collection("users");

    // Find and return the user associated with the token
    const user = await users.findOne({ token: token });

    return user;
  } else {
    // if no cookie exists, redirect to the login page
    return null;
  }
}

export default getUser;