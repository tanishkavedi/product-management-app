export interface User {
  id : number;
  name : string;
  email: string;
  password: string;
  created_at : Date;
}

export interface AuthRequest {
  name? : string;
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: number;
  email: string;
}