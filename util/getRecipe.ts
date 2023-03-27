import useSWR from "swr";
import { GetRecipeAPIData } from "./types";

const fetcher = async (route: string, id: string): Promise<GetRecipeAPIData> => {
  const data = await fetch(route, { method: "GET", body: "" }).then(res => res.json());
  return data;
}

const getRecipe = (id: string) => {
  let { data, error, isLoading } = useSWR<GetRecipeAPIData, Error>([`/api/recipe?id=${id}`, id], fetcher);

  return {
    recipeData: data,
    recipeError: error,
    recipeIsLoading: isLoading
  }
}

export default getRecipe;