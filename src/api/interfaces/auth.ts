import { TokenModel } from "@/models/user";

export interface IAuthService {
  signInWithEmailAndPassword(email: string, password: string): Promise<TokenModel>;
  registerWithEmailAndPassword(email: string, password: string, username: string): Promise<void>;
  deleteAccount(): Promise<void>;
}
