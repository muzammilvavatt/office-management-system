"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function toggleDailyTaskAction(dailyResponsibilityId: string, currentStatus: string) {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const newStatus = currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED";
  const completedAt = newStatus === "COMPLETED" ? new Date() : null;

  // We need today's date normalized (00:00:00)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    await prisma.dailyTaskLog.upsert({
      where: {
        userId_dailyResponsibilityId_date: {
          userId,
          dailyResponsibilityId,
          date: today,
        },
      },
      update: {
        status: newStatus,
        completedAt,
      },
      create: {
        userId,
        dailyResponsibilityId,
        date: today,
        status: newStatus,
        completedAt,
      },
    });
  } catch (error) {
    console.error("Failed to toggle daily task:", error);
    return { error: "Failed to update task" };
  }

  revalidatePath("/dashboard");
}
