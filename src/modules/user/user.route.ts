import httpStatus from "http-status";
import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        name: string;
        id: string;
        role: Role;
      };
    }
  }
}

router.post("/register", userController.registerUser);

router.get(
  "/me",
  (req: Request, res: Response, next: NextFunction) => {
    const { accesstoken } = req.cookies;

    const verifiedToken = jwtUtils.verifyToken(
      accesstoken,
      config.jwt_access_secret,
    );

    if (typeof verifiedToken === "string") {
      throw new Error(verifiedToken);
    }

    const { email, name, role } = verifiedToken;
    const requireRoles = [Role.USER, Role.AUTHOR, Role.ADMIN];

    if (!requireRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        statusCode: httpStatus.FORBIDDEN,
        message: "Forbidden Access to this route for this role",
      });
    }

    req.user = {
      email,
      name,
      id: verifiedToken.id,
      role,
    };

    next();
  },
  userController.getMyProfile,
);

export const userRoutes = router;
