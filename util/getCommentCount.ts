import { Comment } from "./types";

export const getCommentCount = (arr: Comment[]) => {
  let sum = 0;
  const iterate = (arr: Comment[]) => {
    sum += arr.length;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].comments) {
        //@ts-ignore
        iterate(arr[i].comments);
      }
    }
  }
  iterate(arr);
  return sum;
}