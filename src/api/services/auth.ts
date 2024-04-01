import { PiniaStore } from "@/constants/types";
import { TokenModel } from "@/models/user";
import { useAppStore } from "@/store/app";
import { IAuthService } from "../interfaces/auth";

export class AuthService implements IAuthService {
  appStore: PiniaStore<typeof useAppStore>;

  constructor() {
    const appStore = useAppStore();
    this.appStore = appStore;
  }

  async signInWithEmailAndPassword(email: string, password: string): Promise<TokenModel> {
    const { data, error } = await this.appStore.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    return {
      userId: data.user.id,
      expiresAt: data.session.expires_at,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in, // 1h - 3600s
      token: data.session.access_token
    };
  }
}
