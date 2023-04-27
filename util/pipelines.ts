import { Filter } from "./types"

export const getRecipeFilter = (filter: Filter) => [
  { "$match": { public: true } },
  { "$match": { name: { "$regex": new RegExp(filter.searchQuery, "i") } } },
  { "$match": { owner: { "$regex": new RegExp(filter.userFilter, "i") } } },
  filter.tags[0] ? { "$match": { tags: { "$all": filter.tags } } } : { "$match": { name: { "$regex": /[a-z]/i } } },
  { "$match": { "$expr": { "$gte": [{ "$avg": "$ratings.rating" }, filter.minRating * 2] } } },
  { "$match": { "$expr": { "$lte": [filter.maxTime, { "$sum": ["$prepTime", "$cookTime"] }] } } }
]