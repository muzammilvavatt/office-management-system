"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }
}

// --- PROJECT ROLES ---

export async function createProjectRoleAction(prevState: any, formData: FormData) {
  try {
    await requireAdmin();
  } catch (err: any) {
    return { error: err.message };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) return { error: "Name is required" };

  try {
    await prisma.projectRole.create({
      data: { name, description },
    });
  } catch (error) {
    return { error: "Failed to create Project Role. Name may already exist." };
  }

  revalidatePath("/dashboard/settings/roles");
  return { success: true };
}

export async function deleteProjectRoleAction(id: string) {
  await requireAdmin();
  await prisma.projectRole.delete({ where: { id } });
  revalidatePath("/dashboard/settings/roles");
}

// --- DAILY RESPONSIBILITIES ---

export async function createDailyResponsibilityAction(prevState: any, formData: FormData) {
  try {
    await requireAdmin();
  } catch (err: any) {
    return { error: err.message };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) return { error: "Name is required" };

  try {
    await prisma.dailyResponsibility.create({
      data: { name, description },
    });
  } catch (error) {
    return { error: "Failed to create Daily Responsibility. Name may already exist." };
  }

  revalidatePath("/dashboard/settings/roles");
  return { success: true };
}

export async function deleteDailyResponsibilityAction(id: string) {
  await requireAdmin();
  await prisma.dailyResponsibility.delete({ where: { id } });
  revalidatePath("/dashboard/settings/roles");
}
