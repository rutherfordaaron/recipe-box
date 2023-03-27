import useSWR from "swr";
import { GetUserRecipesAPIData } from "./types";

const fetcher = async (route: string): Promise<GetUserRecipesAPIData> => {
  console.log("fetcher called")
  const data = await fetch(route, { method: "GET" }).then(res => res.json());
  console.log(data);
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