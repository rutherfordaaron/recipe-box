import { ObjectId } from "mongodb";

export enum RecipeType {
  Modified = "MODIFIED",
  Copied = "COPIED",
  Original = "ORIGINAL"
}

export type Recipe = {
  name: string,
  description: string,
  owner: string,
  origin: string,
  recipeType: RecipeType,
  ingredients: string[][]
  directions: string[],
  prepTime?: number,
  cookTime?: number,
  servings?: number,
  rating?: number[],
  _id?: ObjectId
}