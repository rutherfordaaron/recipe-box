import { ObjectId } from "mongodb"

export type User = {
  _id?: ObjectId,
  username: string,
  email: string,
  password: string,
  created: Date,
  token: string,
  verified: boolean
}

export type GetUserAPIData = {
  user: User | null,
  message: string
}