import { Role } from '@prisma/client';

export type AuthJwtPayload = {
  sub: number;
};

export type VerificationJwtPayload = {
  userID: number;
};

export type AxiosResponse<T = any> = {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
};
export type UserModelDb = {
  id: number;
  name: string;
  email: string;
  password: string;
  birthday: Date | null;
  role: Role;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  verified: boolean;
};
