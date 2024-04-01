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

    const login = async (email: string, password: string): Promise<void> => {
      const response = await authService.signInWithEmailAndPassword(email, password);
      setToken(response);
      const userData = await getUserData(response.userId);
      user.value = {
        userName: userData.username,
        id: response.userId,
        email
      };
    };

    const setToken = (tokenModel: TokenModel) => {
      token.value = tokenModel;
    };

    const getUserData = async (id: string) => {
      const userData = await accountService.getUserData(id);
      return userData;
    };

    const logOut = () => {
      user.value = null;
      token.value = null;
    };

    return {
      user,
      permissions,
      token,
      isAuthenticated,
      login,
      setToken,
      getUserData,
      logOut
    };
  },
  {
    persist: {
      storage: sessionStorage
    }
  }
);
