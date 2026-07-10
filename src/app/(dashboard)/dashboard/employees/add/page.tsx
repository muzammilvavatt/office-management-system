import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { AddEmployeeForm } from "@/components/AddEmployeeForm";

export default async function AddEmployeePage() {
  const session = await getSession();
  
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const projectRoles = await prisma.projectRole.findMany({ orderBy: { name: "asc" } });
  const dailyResponsibilities = await prisma.dailyResponsibility.findMany({ orderBy: { name: "asc" } });

  return <AddEmployeeForm projectRoles={projectRoles} dailyResponsibilities={dailyResponsibilities} />;
}
