import bcrypt from "bcryptjs";
import crypto from "crypto";
import { UserModel } from "../../users/models/user.model";
export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function generateResetToken() {
  return crypto.randomBytes(32).toString("hex");
}
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");

  const isMatch = await comparePassword(
    currentPassword,
    user.password_hash
  );

  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  user.password_hash = await hashPassword(newPassword);
  user.temp_password = false;
  user.password_changed_at = new Date();

  await user.save();
}