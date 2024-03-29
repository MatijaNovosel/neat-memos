export interface TokenModel {
  token: string;
  expiresAt: string;
}

export interface IUserAccount {
  id: string;
  userName?: string | null;
  email?: string | null;
}
