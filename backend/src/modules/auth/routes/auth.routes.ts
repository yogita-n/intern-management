import { Router } from "express";
import * as AuthController from "../controllers/auth.controller";
import * as PasswordController from "../controllers/password.controller";
import { validateLogin } from "../validators/auth.validator";
import { authMiddleware } from "../../../middlewares/auth";

const router = Router();

router.post("/login", validateLogin, AuthController.login);
router.post("/logout", AuthController.logout);
router.post("/refresh", AuthController.refresh);

router.post("/forgot-password", PasswordController.forgotPassword);
router.post("/reset-password", PasswordController.resetPassword);

router.get("/me", authMiddleware, AuthController.me);

router.put(
  "/change-password",
  authMiddleware,
  PasswordController.changeOwnPassword
);

export default router;
