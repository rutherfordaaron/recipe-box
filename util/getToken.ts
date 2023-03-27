import { NextApiRequest } from "next";
import parseCookie from "./parseCookie";

const getToken = (req: NextApiRequest): string => {
  // Extract authorization token from cookies
  const cookie = req.headers.cookie || "";
  const parsedCookies = parseCookie(cookie);
  return parsedCookies.token;
}

export default getToken;