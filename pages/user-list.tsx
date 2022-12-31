import clientPromise from "../util/db"
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function userList() {
  // let [loading, setLoading] = useState(false);
  // let [users, setUsers] = useState(null);

  // useEffect(() => {
  //   setLoading(true)
  //   fetch('/api/users?all=true')
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setUsers(data)
  //       setLoading(false)
  //     })
  // }, [])

  // if (loading) return <p>Loading...</p>
  // if (!users) return <p>No users</p>

  const router = useRouter();
  const message = router.query["message"] || "";
  return (
    <div>
      <h1>Users in the DB</h1>
      <p>{message}</p>
    </div>
  )
}