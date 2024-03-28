import { TokenModel } from "@/models/user";

export interface IAuthService {
  login(username: string, password: string): Promise<TokenModel>;
}
