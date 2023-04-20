import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../util/db";
import { ObjectId } from "mongodb";
import { Comment } from "../../util/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const depth = req.headers["depth"];
  const newComment = req.headers["new-comment"];
  const recipeId = req.headers["recipe-id"];
  const commentId = req.headers["comment-id"];
  const user = req.headers["user"];
  const indexMap = req.headers["index-map"];
  const client = await clientPromise;
  const db = client.db(process.env.DB);
  const recipes = db.collection("recipes");


  switch (req.method) {
    case "POST":
      // Ensure required data exists
      if (!(depth && recipeId && newComment && user && indexMap)) {
        return res.status(400).json({ success: false, message: "Missing required data" });
      } else if (Number(depth?.toString) > 0 && !commentId) {
        return res.status(400).json({ success: false, message: "Missing required data" });
      }

      // Construct the new comment object
      const commentToInsert: Comment = {
        _id: new ObjectId(),
        user: user.toString(),
        body: newComment.toString(),
        indexMap: JSON.parse(indexMap.toString())
      }

      // If depth is 0, insert comment to top level comment array
      if (depth.toString() == "0") {
        const result = await recipes.updateOne({ _id: new ObjectId(recipeId?.toString()) }, { "$push": { "comments": commentToInsert } });
        if (result.matchedCount > 0) {
          res.status(200).json({ success: true, message: "Comment added successfuly" });
          break;
        } else {
          res.status(500).json({ success: false, message: "Recipe was not added successfuly" });
          break;
        }
      } else {
        // if comment is deeper than index 0, construct an indexString from the given indexMap
        // to easily target where the comment should be added
        const mapData = typeof indexMap == "string" ? JSON.parse(indexMap) : "";
        let indexString = "";
        for (let i = 0; i < mapData.length; i++) {
          indexString += `comments.${mapData[i]}.`
        }
        indexString += "comments";

        // Push comment to database using constructed indexString from indexMap
        const result = await recipes.updateOne({ _id: new ObjectId(recipeId?.toString()) }, { "$push": { [indexString]: commentToInsert } });
        if (result.matchedCount > 0) {
          res.status(200).json({ success: true, message: "Comment added successfuly" });
          break;
        } else {
          res.status(500).json({ success: false, message: "Recipe was not added successfuly" });
          break;
        }
      }
    case "DELETE":
      if (!(commentId && recipeId && user && indexMap)) {
        res.status(400).json({ success: false, message: "Missing required data" });
        break;
      }

      const mapData = JSON.parse(indexMap.toString());
      let indexString = ""
      for (let i = 0; i < mapData.length; i++) {
        if (i == 0) {
          indexString += `comments.${mapData[i]}`
        } else {
          indexString += `.comments.${mapData[i]}`
        }
      }

      const bodyProperty = indexString + ".body";
      const userProperty = indexString + ".user"

      const result = await recipes.updateOne({ _id: new ObjectId(recipeId.toString()) }, { "$set": { [bodyProperty]: "[removed]", [userProperty]: "[removed]" } });
      if (result.matchedCount > 0) {
        res.status(200).json({ success: true, message: "Comment added successfuly" });
        break;
      } else {
        res.status(500).json({ success: false, message: "Recipe was not added successfuly" });
        break;
      }

      break;
    default:
      res.status(401).json({ success: false, message: "Bad method" })
  }
}

export default handler;