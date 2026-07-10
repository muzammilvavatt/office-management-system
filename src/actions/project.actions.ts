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

  // 1. Fetch all master Project Roles
  const allRoles = await prisma.projectRole.findMany();

  // 2. We will map each role to a task. We also try to find ONE user who has this role to assign as a default.
  //    To do this efficiently, we can fetch all UserProjectRoles.
  const userRoles = await prisma.userProjectRole.findMany({
    include: {
      user: true
    }
  });

  try {
    // 3. Create the project and its auto-generated tasks inside a single transaction
    await prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
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

      // 4. Generate a task for each ProjectRole
      for (const role of allRoles) {
        // Find users that have this role assigned
        const eligibleUsers = userRoles.filter(ur => ur.projectRoleId === role.id && ur.user.isActive);
        
        // Pick a default assignee (just pick the first one, or leave unassigned if none)
        const defaultAssigneeId = eligibleUsers.length > 0 ? eligibleUsers[0].userId : null;

        const taskData: any = {
          name: role.name,
          category: "OTHER", // we can leave this generic or map it based on role name
          status: "PENDING",
          priority: "MEDIUM",
          projectId: project.id,
        };

        if (defaultAssigneeId) {
          taskData.assignees = {
            create: [{ userId: defaultAssigneeId }]
          };
        }

        await tx.task.create({
          data: taskData
        });
      }
    });

  } catch (error: any) {
    console.error("Failed to create project with auto-generated roles:", error);
    return { error: "Failed to create project and generate tasks." };
  }

  revalidatePath("/dashboard/projects");
  redirect("/dashboard/projects");
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
