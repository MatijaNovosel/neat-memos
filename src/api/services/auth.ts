import { TokenModel } from "@/models/user";
import { IAuthService } from "../interfaces/auth";

export class AuthService implements IAuthService {
  async login(username: string, password: string): Promise<TokenModel> {
    return {
      expiresAt: "",
      token: ""
    };
  }
}
