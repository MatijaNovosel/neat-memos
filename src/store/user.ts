import { AccountService } from "@/api/services/account";
import { AuthService } from "@/api/services/auth";
import { useNotifications } from "@/composables/useNotifications";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { IUserAccount, TokenModel } from "../models/user";
import { useAppStore } from "./app";
import { useMemoStore } from "./memos";

export const useUserStore = defineStore(
  "user",
  () => {
    // Data
    const user = ref<IUserAccount | null>(null);
    const token = ref<TokenModel | null>(null);
    const isAuthenticated = computed(() => user.value != null);

    // Services
    const authService = new AuthService();
    const accountService = new AccountService();

    // Stores
    const memoStore = useMemoStore();
    const appStore = useAppStore();

    // Composables
    const { alert } = useNotifications();

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

    const register = async (email: string, password: string, username: string) => {
      await authService.registerWithEmailAndPassword(email, password, username);
    };

    const setToken = (tokenModel: TokenModel) => {
      token.value = tokenModel;
    };

    const getUserData = async (id: string) => {
      const userData = await accountService.getUserData(id);
      return userData;
    };

    const updateUsername = async (value: string) => {
      const userId = user.value?.id as string;
      await accountService.changeUsername(userId, value);
      alert({
        text: "User data updated!"
      });
      if (user.value) {
        user.value.userName = value;
      }
    };

    const logOut = async () => {
      user.value = null;
      token.value = null;
      appStore.setTheme("light");
      memoStore.setMemos([]);
      memoStore.memosUpdatedAt = null;
      memoStore.setTags([]);
      memoStore.tagsUpdatedAt = null;
      memoStore.clearFilters();
      await authService.signOut();
      alert({
        text: "Signed out!"
      });
    };

    const deleteAccount = async () => {
      await authService.deleteAccount();
    };

    const tokenExpired = computed(() => {
      if (token.value && token.value.expiresAt) {
        return new Date().getTime() >= token.value.expiresAt * 1000;
      }
      return true;
    });

    return {
      user,
      token,
      isAuthenticated,
      tokenExpired,
      login,
      setToken,
      getUserData,
      logOut,
      register,
      deleteAccount,
      updateUsername
    };
  },
  {
    persist: {
      storage: sessionStorage
    }
  }
);
