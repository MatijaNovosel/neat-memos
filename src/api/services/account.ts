import { IUserAccount } from "@/models/user";
import { IAccountService } from "../interfaces/account";

export class AccountService implements IAccountService {
  async getUserData(): Promise<IUserAccount> {
    return {
      id: "",
      email: "matija@matija.com",
      userName: "matija"
    };
  }
}
