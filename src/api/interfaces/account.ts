import { IUserAccount } from "@/models/user";

export interface IAccountService {
  getUserData(): Promise<IUserAccount>;
}
