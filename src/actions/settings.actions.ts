"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/session";

export async function changePasswordAction(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || !session.user?.id) {
    return { error: "Unauthorized" };
  }

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "All fields are required" };
  }

  if (newPassword !== confirmPassword) {
    return { error: "New passwords do not match" };
  }

  if (newPassword.length < 6) {
    return { error: "New password must be at least 6 characters long" };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return { error: "User not found" };
  }

  const isValid = 
    user.passwordHash === currentPassword || 
    bcrypt.compareSync(currentPassword, user.passwordHash);

  if (!isValid) {
    return { error: "Incorrect current password" };
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(newPassword, salt);

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });
    return { success: "Password successfully updated!" };
  } catch (error) {
    return { error: "Failed to update password" };
  }
}
