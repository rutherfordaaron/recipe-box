import useSWR from "swr";
import { GetUserRecipesAPIData } from "./types";

const fetcher = async (route: string): Promise<GetUserRecipesAPIData> => {
  const data = await fetch(route, { method: "GET" }).then(res => {
    if (!res.ok) return { recipes: null, message: `Something went wrong! Error ${res.status}` }
    return res.json();
  });
  return data;
}

const getUserRecipes = () => {
  let { data, error, isLoading } = useSWR<GetUserRecipesAPIData | null, Error>("/api/user-recipes", fetcher);

  return {
    userRecipesData: data,
    userRecipesError: error,
    userRecipesIsLoading: isLoading
  }
}

export default getUserRecipes