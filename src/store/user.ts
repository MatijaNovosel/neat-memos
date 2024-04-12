import { AccountService } from "@/api/services/account";
import { AuthService } from "@/api/services/auth";
import { useNotifications } from "@/composables/useNotifications";
import supabase from "@/helpers/supabase";
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
    const permissions = ref<number[]>([]);
    const token = ref<TokenModel | null>(null);
    const isAuthenticated = computed(() => user.value != null);

    // Services
    const authService = new AuthService();
    const accountService = new AccountService();

    // Stores
    const memoStore = useMemoStore();
    const appStore = useAppStore();
    const userStore = useUserStore();

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
      const userId = userStore.user?.id as string;
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
      permissions.value = [];
      appStore.setTheme("light");
      memoStore.setMemos([]);
      memoStore.setTags([]);
      memoStore.clearFilters();
      await supabase.auth.signOut();
    };

    const deleteAccount = async () => {
      await authService.deleteAccount();
    };

    return {
      user,
      permissions,
      token,
      isAuthenticated,
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
