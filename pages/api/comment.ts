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


  if (!(depth && recipeId && newComment && user && indexMap)) {
    return res.status(400).json({ success: false, message: "Missing required data" });
  } else if (Number(depth?.toString) > 0 && !commentId) {
    return res.status(400).json({ success: false, message: "Missing required data" });
  }

  const commentToInsert: Comment = {
    _id: new ObjectId(),
    user: user.toString(),
    body: newComment.toString(),
    indexMap: JSON.parse(indexMap.toString())
  }

  switch (req.method) {
    case "POST":
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
        const mapData = typeof indexMap == "string" ? JSON.parse(indexMap) : "";
        let indexString = "";
        for (let i = 0; i < mapData.length; i++) {
          indexString += `comments.${mapData[i]}.`
        }
        indexString += "comments"

        console.log("index string:", indexString);
        console.log("index map:", mapData)

        const result = await recipes.updateOne({ _id: new ObjectId(recipeId?.toString()) }, { "$push": { [indexString]: commentToInsert } });
        console.log("db result:", result)
        if (result.matchedCount > 0) {
          res.status(200).json({ success: true, message: "Comment added successfuly" });
          break;
        } else {
          res.status(500).json({ success: false, message: "Recipe was not added successfuly" });
          break;
        }
      }
      res.status(200).json({ success: true, message: "API successfully reached" });
      break;
    default:
      res.status(401).json({ success: false, message: "Bad method" })
  }
}

export default handler;