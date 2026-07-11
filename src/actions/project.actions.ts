"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }
}

export async function createProjectAction(prevState: any, formData: FormData) {
  try {
    await requireAdmin();
  } catch (err: any) {
    return { error: err.message };
  }

  const name = formData.get("name") as string;
  const clientName = formData.get("clientName") as string;
  const clientPhone = formData.get("clientPhone") as string | null;
  const clientEmail = formData.get("clientEmail") as string | null;
  const location = formData.get("location") as string | null;
  const description = formData.get("description") as string | null;
  const deadlineStr = formData.get("deadline") as string | null;

  if (!name || !clientName) {
    return { error: "Project Name and Client Name are required." };
  }

  let deadline: Date | null = null;
  if (deadlineStr) {
    deadline = new Date(deadlineStr);
  }

  try {
    const project = await prisma.project.create({
      data: {
        name,
        clientName,
        clientPhone,
        clientEmail,
        location,
        description,
        deadline,
        status: "ACTIVE",
        priority: "MEDIUM",
      },
    });


  } catch (error: any) {
    console.error("Failed to create project:", error);
    return { error: "Failed to create project." };
  }

  revalidatePath("/dashboard/projects");
  return { success: true };
}

export async function updateProjectStatusAction(id: string, newStatus: string) {
  await prisma.project.update({
    where: { id },
    data: { status: newStatus },
  });
  revalidatePath("/dashboard/projects");
}

export async function deleteProjectAction(id: string) {
  await requireAdmin();
  await prisma.project.delete({
    where: { id },
  });
  revalidatePath("/dashboard/projects");
  revalidatePath("/dashboard");
}

export async function editProjectAction(id: string, prevState: any, formData: FormData) {
  try {
    await requireAdmin();
  } catch (err: any) {
    return { error: err.message };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const clientName = formData.get("clientName") as string;
  const clientEmail = formData.get("clientEmail") as string;
  const clientPhone = formData.get("clientPhone") as string;
  const location = formData.get("location") as string;
  const deadlineStr = formData.get("deadline") as string;
  const status = formData.get("status") as string;

  if (!name || !clientName) {
    return { error: "Project Name and Client Name are required" };
  }

  let deadline = null;
  if (deadlineStr) {
    deadline = new Date(deadlineStr);
  }

  try {
    await prisma.project.update({
      where: { id },
      data: {
        name,
        description,
        clientName,
        clientEmail,
        clientPhone,
        location,
        deadline,
        status: status || "ACTIVE",
      },
    });
  } catch (error) {
    return { error: "Failed to update project" };
  }

  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${id}`);
  revalidatePath("/dashboard");
  redirect(`/dashboard/projects/${id}`);
}
