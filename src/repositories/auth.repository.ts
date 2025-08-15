import { PrismaClient } from "@prisma/client";
import { UserData } from "../controllers/auth.controller";

const prisma = new PrismaClient();

export const createUser = async (data: UserData) => {
  return await prisma.user.create({
    data,
  });
};

export const findByUsername = async (username: string) => {
  return await prisma.user.findUnique({
    where: {
      username,
    },
  });
};

export const findByEmail = async (email: string) => {
  return await prisma.user.findFirst({
    where: {
      email,
    },
  });
};
