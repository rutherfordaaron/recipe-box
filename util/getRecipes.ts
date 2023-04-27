import useSWR from "swr";
import { Filter, GetRecipesAPIData } from "./types";

const fetcher = async (route: string): Promise<GetRecipesAPIData> => {
  const data = await fetch(route, { method: "GET" }).then(res => res.json());
  return data;
}

export const getRecipes = (filter: Filter, isPublic?: boolean) => {
  let { data, error, isLoading } = useSWR<GetRecipesAPIData, Error>(`/api/${isPublic ? "public" : "user"}-recipes?filter=${JSON.stringify(filter)}`, fetcher);

  return { data, error, isLoading }
}

export default getRecipes;