import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { IloginUser } from "./auth.interface";
import Jwt, { SignOptions } from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";

const loginUser = async (payload: IloginUser) => {
  const { email, password } = payload;
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Password does not match");
  }

  const jwtpayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  //   const accesstoken = Jwt.sign(jwtpayload, config.jwt_access_secret, {
  //     expiresIn: config.jwt_access_expires_in,
  //   } as SignOptions);

  const accesstoken = jwtUtils.createToken(
    jwtpayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  //   const refreshtoken = Jwt.sign(jwtpayload, config.jwt_refresh_secret, {
  //     expiresIn: config.jwt_refresh_expires_in,
  //   } as SignOptions);

  const refreshtoken = jwtUtils.createToken(
    jwtpayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return { accesstoken, refreshtoken };
};

export const authService = {
  loginUser,
};
