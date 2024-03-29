import { AccountService } from "@/api/services/account";
import { AuthService } from "@/api/services/auth";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { IUserAccount, TokenModel } from "../models/user";

export const useUserStore = defineStore(
  "user",
  () => {
    // Data
    const user = ref<IUserAccount | null>(null);
    const permissions = ref<number[]>([]);
    const token = ref<TokenModel | null>(null);
    const isAuthenticated = computed(() => user.value != null);

    // Services
    const authService = new AuthService();
    const accountService = new AccountService();

    const login = async (userName: string, password: string): Promise<void> => {
      const response = await authService.login(userName, password);
      setToken(response);
      await getUserData();
    };

    const setToken = (tokenModel: TokenModel) => {
      token.value = tokenModel;
    };

    const getUserData = async () => {
      const userData = await accountService.getUserData();
      user.value = {
        id: "3ff413cc-c9c2-4723-8d8b-7cb7e0295463",
        userName: userData.userName,
        email: userData.email
      };
      permissions.value = [];
    };

    const logOut = () => {
      user.value = null;
      token.value = null;
    };

    const clearUserData = () => {
      document.cookie = "uc=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
      token.value = null;
      user.value = null;
      permissions.value = [];
    };

    return {
      user,
      permissions,
      token,
      isAuthenticated,
      login,
      setToken,
      getUserData,
      clearUserData,
      logOut
    };
  },
  {
    persist: {
      storage: sessionStorage
    }
  }
);
