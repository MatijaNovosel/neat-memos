import { UserDataModel } from "@/models/user";

export interface IAccountService {
  getUserData(userId: string): Promise<UserDataModel>;
  changeUsername(userId: string, username: string): Promise<void>;
  deleteAccount(): Promise<void>;
}
