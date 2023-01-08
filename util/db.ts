import { MongoClient } from 'mongodb';

// Make sure there is a URI string environment variable 
if (!process.env.DB_URI) {
  throw new Error("Missing environment variable: 'DB_URI'");
}

const client = new MongoClient(process.env.DB_URI);
const clientPromise = client.connect();

export default clientPromise;