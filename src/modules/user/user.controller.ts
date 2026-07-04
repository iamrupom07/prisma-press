import httpStatus from "http-status";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";

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
    res.status(httpStatus.CREATED).json({
      success: true,
      statuCode: httpStatus.CREATED,
      message: "User created successfully",
      data: {
        user,
      },
    });
  },
);

export const userController = {
  registerUser,
};
