export interface TokenModel {
  userId: string;
  token: string;
  refreshToken: string;
  expiresAt?: number;
  expiresIn: number; // Seconds
}

export interface IUserAccount {
  id: string;
  userName?: string | null;
  email?: string | null;
}

export interface UserDataModel {
  username: string;
}
