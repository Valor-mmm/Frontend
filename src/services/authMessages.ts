export enum AuthRole {
  USER,
  ADMIN
}

export interface ILoginMessage {
  role: AuthRole,
  success: boolean
}

export class LoginMessage implements ILoginMessage{
  role: AuthRole;
  success: boolean;

  constructor(role: AuthRole, success: boolean) {
    this.role = role;
    this.success = success;
  }
}

