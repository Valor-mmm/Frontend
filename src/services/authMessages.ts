export enum AuthRole {
  USER,
  ADMIN
}

export interface ILoginMessage {
  role: AuthRole,
  success: boolean
  message?: string
}

export class LoginMessage implements ILoginMessage{
  role: AuthRole;
  success: boolean;
  message?: string;

  constructor(role: AuthRole, success: boolean) {
    this.role = role;
    this.success = success;
  }


}

