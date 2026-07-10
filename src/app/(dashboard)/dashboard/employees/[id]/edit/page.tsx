import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect, notFound } from "next/navigation";
import { EditEmployeeForm } from "@/components/EditEmployeeForm";

export default async function EditEmployeePage(props: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const projectRoles = await prisma.projectRole.findMany({ orderBy: { name: "asc" } });
  const dailyResponsibilities = await prisma.dailyResponsibility.findMany({ orderBy: { name: "asc" } });

  const { id } = await props.params;

  const employee = await prisma.user.findUnique({
    where: { id },
    include: {
      projectRoles: true,
      dailyResponsibilities: true,
    }
  });

  if (!employee) {
    notFound();
  }

  // Format the assigned arrays to just arrays of IDs for the client component
  const assignedProjectRoles = employee.projectRoles.map((pr: any) => pr.projectRoleId);
  const assignedDailyResponsibilities = employee.dailyResponsibilities.map((dr: any) => dr.dailyResponsibilityId);

  return (
    <EditEmployeeForm 
      employee={employee} 
      projectRoles={projectRoles} 
      dailyResponsibilities={dailyResponsibilities}
      assignedProjectRoles={assignedProjectRoles}
      assignedDailyResponsibilities={assignedDailyResponsibilities}
    />
  );
}
