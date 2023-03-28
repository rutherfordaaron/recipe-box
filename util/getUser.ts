import useSWR from "swr";
import { GetUserAPIData } from "./types";

const fetcher = async (route: string): Promise<GetUserAPIData> => {
  const data = await fetch(route, { method: "GET" }).then(res => res.json());
  return data;
}

const getUser = () => {
  let { data, error, isLoading } = useSWR<GetUserAPIData, Error>(`/api/users`, fetcher);

  return {
    userData: data,
    userError: error,
    userIsLoading: isLoading
  }
}

export default getUser;