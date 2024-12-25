import { Role } from '@prisma/client';

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
