const parseCookie = (cookie: string) => {
  // Return an empty object if cookie is empty
  if (!cookie)
    return {};

  // Get each individual key-value pairs from the cookie string
  let pairs = cookie.split(";");

  // Separate keys from values in each pair string
  let splittedPairs = pairs.map(cookie => cookie.split("="));


  // Create an object with all key-value pairs
  const cookieObj = splittedPairs.reduce(function (obj: any, cookie) {

    // cookie[0] is the key of cookie
    // cookie[1] is the value of the cookie 
    // decodeURIComponent() decodes the cookie string, to handle cookies with special characters, 
    // string.trim() trims the blank spaces around the key and value.
    const key = decodeURIComponent(cookie[0].trim());
    const value = decodeURIComponent(cookie[1].trim());

    obj[key] = value;

    return obj;
  }, {})

  return cookieObj;
}
export default parseCookie;