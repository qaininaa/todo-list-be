import { UserData, UserLoginData } from "../controllers/auth.controller";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import * as authRepository from "../repositories/auth.repository";

const { ACCESS_SECRET, REFRESH_SECRET } = process.env as {
  ACCESS_SECRET: string;
  REFRESH_SECRET: string;
};

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error("JWT secrets are not set in environment variables");
}

export const registerUser = async (data: UserData) => {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await authRepository.findByUsername(data.username);
    const alreadyEmail = await authRepository.findByEmail(data.email);

    if (user) throw new Error("User Already Exist");
    if (alreadyEmail) throw new Error("Email Already Exist");
    const newUser = await authRepository.createUser({
      ...data,
      password: hashedPassword,
    });

    return newUser;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

export const loginUser = async (data: UserLoginData) => {
  try {
    if (!data) {
      throw new Error("Enter data user");
    }
    const user = await authRepository.findByUsername(data.username);
    console.log(user);

    if (!user || user === null) {
      throw new Error("User is not found");
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new Error("Wrong password");
    }

    const payload = {
      username: user.username,
      email: user.email,
      name: user.name,
    };

    const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: "1m" });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
      expiresIn: "5d",
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};
