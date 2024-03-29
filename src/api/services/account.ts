import { IUserAccount } from "@/models/user";
import { IAccountService } from "../interfaces/account";

export class AccountService implements IAccountService {
  async getUserData(): Promise<IUserAccount> {
    return {
      id: "3ff413cc-c9c2-4723-8d8b-7cb7e0295463",
      email: "matija@matija.com",
      userName: "matija"
    };
  }
}
