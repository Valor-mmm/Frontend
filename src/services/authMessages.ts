export enum AuthRole {
  USER,
  ADMIN
}

export interface ILoginMessage {
  role: AuthRole,
  success: boolean
  failed: boolean
  message?: string
  id?: string
}

export class LoginMessage implements ILoginMessage {
  role: AuthRole;
  success: boolean;
  failed: boolean;
  message?: string;
  id?: string;

  constructor(role: AuthRole, success: boolean, failed: boolean) {
    this.role = role;
    this.success = success;
    this.failed = failed;
  }

}

export class FailedLogin {

  role: AuthRole;
  message?: string;

  constructor(role: AuthRole, message: string) {
    this.role = role;
    this.message = message;
  }

}

