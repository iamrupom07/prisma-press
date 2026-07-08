import Jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: SignOptions,
) => {
  const token = Jwt.sign(payload, secret, {
    expiresIn,
  } as SignOptions);
  return token;
};

const verifyToken = (token: string, secret: string) => {
  try {
    const verifiedToken = Jwt.verify(token, secret);
    return verifiedToken;
  } catch (error) {
    console.log("token verification failed", error);
    throw new Error("Invalid token");
  }
};

export const jwtUtils = {
  createToken,
  verifyToken,
};
