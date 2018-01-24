export class TimeLineDesc {
  isLoggedInUser: boolean;
  title: string;

  constructor(isLoggedInUser: boolean, title:string) {
    this.isLoggedInUser = isLoggedInUser;
    this.title = title;
  }
}
