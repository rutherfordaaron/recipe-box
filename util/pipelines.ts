import { Filter, SortParameter } from "./types"

const matchAll = { "$match": { name: { "$regex": /[a-z]/i } } }

export const getRecipeFilter = (filter: Filter, isPrivate?: boolean, user?: string) => [
  isPrivate ? { "$match": { owner: user } } : { "$match": { public: true } },
  { "$match": { name: { "$regex": new RegExp(filter.searchQuery, "i") } } },
  { "$match": { owner: { "$regex": new RegExp(filter.userFilter, "i") } } },
  filter.tags[0] ? { "$match": { tags: { "$all": filter.tags } } } : matchAll,
  { "$match": { "$expr": { "$gte": [{ "$avg": "$ratings.rating" }, filter.minRating * 2] } } },
  { "$match": { "$expr": { "$lte": [filter.maxTime, { "$sum": ["$prepTime", "$cookTime"] }] } } },
  { "$project": { name: 1, description: 1, owner: 1, prepTime: 1, cookTime: 1, rating: 1, comments: 1, created: 1, updated: 1, tags: 1, origin: 1, ratings: 1, public: 1, avgRating: { "$divide": [{ "$avg": "$ratings.rating" }, 2] } } },
  ...getSortStep(filter.sort)
]

const getSortStep = (sort: SortParameter | undefined): Object[] => {
  switch (sort) {
    case "Rating":
      return [{ "$sort": { "avgRating": -1, "created": -1 } }]
    case "User":
      return [{ "$sort": { "owner": 1, "created": -1 } }]
    default:
      return [{ "$sort": { "created": -1 } }]
  }
}