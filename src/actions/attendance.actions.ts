"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function clockInAction() {
  const session = await getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id;
  const now = new Date();
  
  // Create a date object representing midnight of the local time
  // Using UTC midnight for simple comparison of the same day
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // Check if already clocked in today
  const existingRecord = await prisma.attendance.findFirst({
    where: {
      userId,
      date: {
        gte: todayStart,
      },
    }
  });

  if (existingRecord) {
    return { error: "Already clocked in today" };
  }

  // Determine status (LATE if clocked in after 10:00 AM)
  let status = "PRESENT";
  const lateThreshold = new Date();
  lateThreshold.setHours(10, 0, 0, 0);
  
  if (now > lateThreshold) {
    status = "LATE";
  }

  await prisma.attendance.create({
    data: {
      userId,
      date: todayStart,
      clockIn: now,
      status,
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/attendance");
}

export async function clockOutAction() {
  const session = await getSession();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id;
  const now = new Date();
  
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const existingRecord = await prisma.attendance.findFirst({
    where: {
      userId,
      date: {
        gte: todayStart,
      },
    },
    orderBy: {
      clockIn: 'desc'
    }
  });

  if (!existingRecord) {
    return { error: "No clock in record found for today" };
  }

  if (existingRecord.clockOut) {
    return { error: "Already clocked out today" };
  }

  await prisma.attendance.update({
    where: { id: existingRecord.id },
    data: { clockOut: now }
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/attendance");
}
