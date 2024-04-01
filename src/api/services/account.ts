import { PiniaStore } from "@/constants/types";
import { UserDataModel } from "@/models/user";
import { useAppStore } from "@/store/app";
import { IAccountService } from "../interfaces/account";

export class AccountService implements IAccountService {
  appStore: PiniaStore<typeof useAppStore>;

  constructor() {
    const appStore = useAppStore();
    this.appStore = appStore;
  }

  async getUserData(userId: string): Promise<UserDataModel> {
    const { data, error } = await this.appStore.supabase
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
