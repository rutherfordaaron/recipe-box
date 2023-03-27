import useSWR from "swr";
import { GetUserRecipesAPIData } from "./types";

const fetcher = async (route: string): Promise<GetUserRecipesAPIData> => {
  const data = await fetch(route, { method: "GET" }).then(res => res.json());
  return data;
}

const getUserRecipes = () => {
  let { data, error, isLoading } = useSWR<GetUserRecipesAPIData | null, Error>("/api/user-recipes", fetcher);

  return {
    data,
    error,
    isLoading
  }
}

export default getUserRecipes