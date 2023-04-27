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
  public?: boolean,
  comments?: Comment[]
}

export type Ingredient = { ingredient: string, measurement: string, id: string }

export type GetUserAPIData = {
  user: User | null,
  message: string
}

export type GetRecipesAPIData = {
  recipes: Recipe[] | null,
  message: string,
  matched: number;
}

export type GetRecipeAPIData = {
  recipe: Recipe | null,
  message: string
}

export type SortParameter = "New" | "Rating" | "User"

export type Comment = {
  _id: ObjectId,
  indexMap: number[],
  user: string,
  body: string,
  likes?: string[],
  comments?: Comment[],
}

export const defaultTags = ["breakfast", "lunch", "dinner", "dessert", "snack", "sides", "drinks", "vegetarian", "gluten free", "lactose free", "vegan", "other"]

export type Filter = {
  searchQuery: string,
  tags: string[],
  userFilter: string,
  minRating: number,
  maxTime: number,
  sort?: SortParameter,
}

export const emptyFilter: Filter = {
  searchQuery: "",
  tags: [],
  userFilter: "",
  minRating: 0,
  maxTime: 0,
  sort: "New"
}