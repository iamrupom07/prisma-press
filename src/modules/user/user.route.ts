import httpStatus from "http-status";
import { Request, Response, Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.post("/register", userController.registerUser);

router.get("/me", userController.getMyProfile);

export const userRoutes = router;
