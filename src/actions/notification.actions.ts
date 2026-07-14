"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function getNotificationsAction() {
  const session = await getSession();
  
  if (!session?.user?.id) {
    return { notifications: [] };
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5
    });

    return { notifications };
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return { notifications: [] };
  }
}

export async function markNotificationsAsReadAction() {
  const session = await getSession();
  if (!session?.user?.id) return { success: false };

  try {
    await prisma.notification.updateMany({
      where: { 
        userId: session.user.id,
        isRead: false
      },
      data: { isRead: true }
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to mark notifications as read:", error);
    return { success: false };
  }
}

export async function clearAllNotificationsAction() {
  const session = await getSession();
  if (!session?.user?.id) return { success: false };

  try {
    await prisma.notification.deleteMany({
      where: { userId: session.user.id }
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to clear notifications:", error);
    return { success: false };
  }
}
