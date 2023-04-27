import useSWR from "swr";
import { Filter, GetPublicRecipesAPIData } from "./types";

const fetcher = async (route: string): Promise<GetPublicRecipesAPIData> => {
  const data = await fetch(route, { method: "GET" }).then(res => res.json());
  return data;
}

const getPublicRecipes = (filter: Filter) => {
  let { data, error, isLoading } = useSWR<GetPublicRecipesAPIData, Error>(`/api/public-recipes?filter=${JSON.stringify(filter)}`, fetcher);

  return {
    publicRecipesData: data,
    publicRecipesError: error,
    publicRecipesIsLoading: isLoading
  }
}

export default getPublicRecipes