import httpStatus from "http-status";
import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { ActiveStatus, Role } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";

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

const auth = (...requireRoles : Role[]) => {
  return catchAsync( async (req : Request , res : Response , next : NextFunction) => {

    const token = req.cookies.accesstoken 
    
    // || req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization?.split(" ")[1] : req.headers.authorization

    if(!token){
      throw new Error("You are not logged in. Please log in to access this resourse")
    }

    const verifiedToken = jwtUtils.verifyToken(
      token,
      config.jwt_access_secret,
    );

   if (!verifiedToken.success){
    throw new Error(verifiedToken.error);
    
   }

   const {id, email, name, role } = verifiedToken.data as JwtPayload;

  

   if(requireRoles.length && !requireRoles.includes(role)){
    throw new Error("Unauthorized access")
   }

   const user = await prisma.user.findUnique({
    where : {
      id,
      email,
      name,
      role
    }
   })

   if(!user){
    throw new Error("User not found")
   }

   if(user.activeStatus === "BLOCKED"){
    throw new Error("User is blocked")
   }

   req.user = {
    id : user.id,
    email : user.email,
    name : user.name,
    role : user.role,
   }

   next();

  }
)
}

router.get(
  "/me",
  // (req: Request, res: Response, next: NextFunction) => {
  //   const { accesstoken } = req.cookies;

  //   const verifiedToken = jwtUtils.verifyToken(
  //     accesstoken,
  //     config.jwt_access_secret,
  //   );

  //  if (!verifiedToken.success){
  //   throw new Error(verifiedToken.error);
    
  //  }

  //   const {id, email, name, role } = verifiedToken.data as JwtPayload;
  //   const requireRoles = [Role.USER, Role.AUTHOR, Role.ADMIN];

  //   if (!requireRoles.includes(role)) {
  //     return res.status(400).json({
  //       success: false,
  //       statusCode: httpStatus.FORBIDDEN,
  //       message: "Forbidden Access to this route for this role",
  //     });
  //   }

  //   req.user = {
  //     id,
  //     email,
  //     name,
     
  //     role,
  //   };

  //   next();
  // },

  auth(Role.ADMIN, Role.USER, Role.AUTHOR),
  userController.getMyProfile,
);

export const userRoutes = router;
