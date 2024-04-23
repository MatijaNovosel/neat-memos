import supabase from "@/helpers/supabase";
import { TokenModel } from "@/models/user";
import { IAuthService } from "../interfaces/auth";

export class AuthService implements IAuthService {
  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  deleteAccount(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async registerWithEmailAndPassword(
    email: string,
    password: string,
    username: string
  ): Promise<void> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) throw error;

    // Create data table
    const { error: dataTableError } = await supabase.from("userData").insert([
      {
        username,
        userId: data.user!.id
      }
    ]);

    if (dataTableError) throw dataTableError;
  }

  async signInWithEmailAndPassword(email: string, password: string): Promise<TokenModel> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    return {
      userId: data.user.id,
      expiresAt: data.session.expires_at,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in, // 1h - 3600s
      token: data.session.access_token
    };
  }
}
