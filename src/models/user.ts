export interface TokenModel {
  token: string;
  expiresAt: string;
}

export interface IUserAccount {
  id: number;
  userName?: string | null;
  email?: string | null;
}
