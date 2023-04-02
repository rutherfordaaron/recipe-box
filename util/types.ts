import { ObjectId } from "mongodb"

export type User = {
  _id?: ObjectId,
  username: string,
  email: string,
  password: string,
  created: Date,
  token: string,
  verified: boolean,
  tags?: string[],
  updated?: Date
}

export enum RecipeType {
  Modified = "MODIFIED",
  Copied = "COPIED",
  Original = "ORIGINAL"
}

export type Recipe = {
  _id?: ObjectId,
  name: string,
  description?: string,
  owner: string,
  origin: string,
  recipeType: RecipeType,
  ingredients: Ingredient[]
  directions: string[],
  prepTime?: number,
  cookTime?: number,
  servings?: number,
  rating?: number[],
  tags?: string[],
  created: Date,
  updated?: Date
}

export type Ingredient = { ingredient: string, measurement: string, id: string }

export type GetUserAPIData = {
  user: User | null,
  message: string
}

export type GetUserRecipesAPIData = {
  recipes: Recipe[] | null,
  message: string
}

export type GetRecipeAPIData = {
  recipe: Recipe | null,
  message: string
}