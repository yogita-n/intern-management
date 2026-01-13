import { Response,Request } from "express";
import { UserModel } from "../../users/models/user.model";
import * as PasswordService from "../services/password.service";
import { SessionModel } from "../models/session.model";
import { AuthRequest } from "../../../middlewares/auth";
import crypto from "crypto";
import bcrypt from "bcryptjs"

export async function forgotPassword(req:Request, res:Response) {
  const { email } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) return res.json({ message: "OK" });

  const token = crypto.randomBytes(32).toString("hex");
  console.log("Reset token:",token);

  user.reset_token = token;
  user.reset_expires = new Date(Date.now() + 3600000);
  await user.save();

  res.json({ message: "Password reset sent" });
}

export async function resetPassword(req:Request, res:Response) {
  const { token, password } = req.body;

  const user = await UserModel.findOne({
    reset_token: token,
    reset_expires: { $gt: new Date() }
  });

  if (!user) throw new Error("Invalid token");

  user.password_hash = await PasswordService.hashPassword(password);
  user.reset_token = null;
  user.reset_expires = null;
  user.temp_password = false;

  await user.save();

  res.json({ message: "Password updated" });
}

export async function changeOwnPassword(req: Request, res: Response) {
  const userId = (req as any).user.user_id; // from JWT
  const { currentPassword, newPassword } = req.body;

  await PasswordService.changePassword(userId, currentPassword, newPassword);

  res.json({ message: "Password changed successfully" });
}