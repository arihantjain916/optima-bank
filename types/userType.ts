import { User } from "@prisma/client";

export type RegisterUserType = {
  email: string;
  password: string;
  name: string;
};

export type LoginUserType = {
  email: string;
  password: string;
};

export type DashboardUserType = {
  totalReceived: number;
  totalSent: number;
};

export type DashboardType = User & DashboardUserType;

export type updateProfileType = {
  name?: string;
  email?: string;
  password?: string;
};
