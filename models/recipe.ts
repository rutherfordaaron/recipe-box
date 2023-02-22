import { ObjectId } from "mongodb";

export enum RecipeType {
  Modified = "MODIFIED",
  Copied = "COPIED",
  Original = "ORIGINAL"
}

export default class Recipe {
  constructor(
    public name: string,
    public description: string,
    public owner: string,
    public origin: string,
    public recipeType: RecipeType,
    public ingredients: string[][],
    public directions: string[],
    public prepTime: number | undefined,
    public cookTime: number | undefined,
    public servingsYield: number | undefined,
    public rating: number[] | undefined,
    public _id?: ObjectId
  ) {
    this.name = name;
    this.description = description;
    this.owner = owner;
    this.origin = origin;
    this.recipeType = recipeType;
    this.ingredients = ingredients;
    this.directions = directions;
    this.prepTime = prepTime;
    this.cookTime = cookTime;
    this.servingsYield = servingsYield;
    this.rating = rating;
    if (_id) {
      this._id = _id;
    }
  }
}