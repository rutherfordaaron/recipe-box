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
  Modified = "Modified",
  Copied = "Copied",
  Original = "Original"
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
  ratings: { user: string, rating: number }[],
  tags?: string[],
  created: Date,
  updated?: Date,
  public?: boolean
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

export enum SortParameter {
  Unsorted = "Unsorted",
  Ascending = "Ascending",
  Descending = "Descending",
  RecentlyCreated = "Recently Created",
  RecentlyUpdated = "Recently Updated",
  OldestCreated = "Oldest Created",
  OldestUpdated = "Oldest Updated"
}

export type GetPublicRecipesAPIData = {
  recipes: Recipe[] | null,
  message: string
}

export const defaultTags = ["breakfast", "lunch", "dinner", "dessert", "snack", "sides", "drinks", "vegetarian", "gluten free", "lactose free", "vegan", "other"]