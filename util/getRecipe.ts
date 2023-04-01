import useSWR from "swr";
import { GetRecipeAPIData } from "./types";

const fetcher = async (route: string, id: string): Promise<GetRecipeAPIData> => {
  const data = await fetch(route, { method: "GET" })
    .then(res => {
      if (!res.ok) return { recipe: null, message: `Something went wrong! Error ${res.status}` }
      return res.json();
    });
  return data;
}

const getRecipe = (id: string) => {
  let { data, error, isLoading } = useSWR<GetRecipeAPIData, Error>(`/api/recipe?id=${id}`, fetcher);

  return {
    recipeData: data,
    recipeError: error,
    recipeIsLoading: isLoading
  }
}

export default getRecipe;