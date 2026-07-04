import httpStatus from "http-status";
import { Request, Response } from "express";
import { userService } from "./user.service";

const registerUser = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    console.log(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to create user",
      error: (error as Error).message,
    });
  }
};

export const userController = {
  registerUser,
};
