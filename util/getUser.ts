import useSWR from "swr";
import { GetUserAPIData } from "./types";

const fetcher = async (route: string): Promise<GetUserAPIData> => {
  const data = await fetch(route, { method: "GET" }).then(res => res.json());
  return data;
}

const getUser = () => {
  let { data, error, isLoading } = useSWR<GetUserAPIData, Error>(`/api/users`, fetcher);
  console.log("getUser called")

  return {
    data,
    error,
    isLoading
  }
}

export default getUser;