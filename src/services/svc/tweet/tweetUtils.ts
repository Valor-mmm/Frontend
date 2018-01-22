import {IUser} from "../user/userUtils";

export interface ITweet {

  id: string,
  updatedAt: string,
  createdAt: string

  content: string,
  imgId?: string,
  poster: IUser,
  upvotes: number

}
