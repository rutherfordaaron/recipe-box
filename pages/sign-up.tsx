import { useRouter } from "next/router"

export default function signUp() {
  const router = useRouter();
  const error = router.query["error"] || "";
  return (
    <main>
      <h1>Enter your information below</h1>
      <p><strong><em>Error: {error}</em></strong></p>
      <form action="/api/users" method="POST">
        <label htmlFor="first">First Name:</label>
        <input
          required
          type="text"
          id="first"
          name="first"
        />

        <label htmlFor="last">Last Name:</label>
        <input
          required
          type="text"
          id="last"
          name="last"
        />

        <label htmlFor="user">User Name:</label>
        <input
          required
          type="text"
          id="user"
          name="user"
        />

        <label htmlFor="email">Email:</label>
        <input
          required
          type="email"
          id="email"
          name="email"
        />

        <label htmlFor="pass">Password:</label>
        <input
          required
          type="password"
          id="pass"
          name="pass"
        />

        <button type="submit">Submit</button>
      </form>
    </main>
  )
}