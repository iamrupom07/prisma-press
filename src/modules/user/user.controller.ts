import httpStatus from "http-status";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import jwt from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";

// const registerUser = async (req: Request, res: Response) => {
//   try {
//     const payload = req.body;

//     const user = await userService.registerUserintoDB(payload);

//     res.status(httpStatus.CREATED).json({
//       success: true,
//       statuCode: httpStatus.CREATED,

//       message: "User created successfully",
//       data: {
//         user,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       success: false,
//       statusCode: httpStatus.INTERNAL_SERVER_ERROR,
//       message: "Failed to create user",
//       error: (error as Error).message,
//     });
//   }
// };

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await userService.registerUserintoDB(payload);
    // res.status(httpStatus.CREATED).json({
    //   success: true,
    //   statuCode: httpStatus.CREATED,
    //   message: "User created successfully",
    //   data: {
    //     user,
    //   },
    // });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User created successfully",
      data: {
        user,
      },
    });
  },
);

const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { accesstoken } = req.cookies;

    const verifiedToken = jwtUtils.verifyToken(
      accesstoken,
      config.jwt_access_secret,
    );

    if (typeof verifiedToken === "string") {
      throw new Error(verifiedToken);
    }

    const profile = await userService.getMyProfileFromDB(verifiedToken.id);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User profile fetched successfully",
      data: {
        profile,
      },
    });

    res.send("getMyProfile");
  },
);

export const userController = {
  registerUser,
  getMyProfile,
};
