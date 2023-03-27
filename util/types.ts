import { ObjectId } from "mongodb"

export type User = {
  _id?: ObjectId,
  username: string,
  email: string,
  password: string,
  created: Date,
  token: string,
  verified: boolean
}

export enum RecipeType {
  Modified = "MODIFIED",
  Copied = "COPIED",
  Original = "ORIGINAL"
}

export type Recipe = {
  _id: ObjectId,
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
}

export type GetUserAPIData = {
  user: User | null,
  message: string
}

export type GetUserRecipesAPIData = {
  recipes: Recipe[] | null,
  message: string
}