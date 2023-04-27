import useSWR from "swr";
import { Filter, GetRecipesAPIData } from "./types";

const fetcher = async (route: string): Promise<GetRecipesAPIData> => {
  const data = await fetch(route, { method: "GET" }).then(res => res.json());
  return data;
}

export const getRecipes = (filter: Filter, pagination: { size: number, page: number }, isPublic?: boolean) => {
  let { data, error, isLoading } = useSWR<GetRecipesAPIData, Error>(`/api/${isPublic ? "public" : "user"}-recipes?filter=${JSON.stringify(filter)}&size=${pagination.size}&page=${pagination.page}`, fetcher);
  const length = 3;

  return { data, error, isLoading, length }
}

export default getRecipes;