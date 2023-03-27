import useSWR from "swr";
import { GetUserAPIData } from "./types";

const fetcher = async (route: string): Promise<GetUserAPIData> => {
  console.log("fetcher called")
  const data = await fetch(route, { method: "GET" }).then(res => res.json());
  console.log(data);
  return data;
}

const getUser = () => {
  let { data, error, isLoading } = useSWR<GetUserAPIData, Error>(`/api/users`, fetcher);
  console.log("getUser called")

  return ({
    data: data ? data : undefined,
    isError: error,
    isLoading: isLoading
  })
}

export default getUser;