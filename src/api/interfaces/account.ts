import { UserDataModel } from "@/models/user";

export interface IAccountService {
  getUserData(userId: string): Promise<UserDataModel>;
}
