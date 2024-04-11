import supabase from "@/helpers/supabase";
import { UserDataModel } from "@/models/user";
import { IAccountService } from "../interfaces/account";

export class AccountService implements IAccountService {
  async getUserData(userId: string): Promise<UserDataModel> {
    const { data, error } = await supabase
      .from("userData")
      .select("username, darkMode, language, createdAt")
      .eq("userId", userId);

    if (error) {
      throw error;
    }

    const user = data[0];

    return {
      username: user.username
    };
  }
}
