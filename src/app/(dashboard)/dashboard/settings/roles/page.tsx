import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/DeleteButton";
import { deleteProjectRoleAction, deleteDailyResponsibilityAction } from "@/actions/settings.actions";
import { AddProjectRoleForm } from "@/components/AddProjectRoleForm";
import { AddDailyResponsibilityForm } from "@/components/AddDailyResponsibilityForm";

export default async function RolesSettingsPage() {
  const session = await getSession();
  
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const projectRoles = await prisma.projectRole.findMany({ orderBy: { name: "asc" } });
  const dailyTasks = await prisma.dailyResponsibility.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Master Roles & Responsibilities</h2>
        <p className="text-slate-500">Manage the dynamic lists used for assigning tasks to employees.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PROJECT ROLES */}
        <div className="space-y-6">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle>Project Roles</CardTitle>
              <CardDescription>Roles that are automatically assigned when a new project is created.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-semibold">Name</th>
                    <th scope="col" className="px-6 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projectRoles.map(role => (
                    <tr key={role.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-3 font-medium text-slate-900">{role.name}</td>
                      <td className="px-6 py-3 text-right">
                        <form action={deleteProjectRoleAction.bind(null, role.id)}>
                          <DeleteButton itemName="Project Role" />
                        </form>
                      </td>
                    </tr>
                  ))}
                  {projectRoles.length === 0 && (
                    <tr>
                      <td colSpan={2} className="px-6 py-6 text-center text-slate-500">No project roles defined.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="p-6 border-t border-slate-100 bg-slate-50/30">
                <h4 className="text-sm font-semibold mb-3">Add New Project Role</h4>
                <AddProjectRoleForm />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* DAILY TASKS */}
        <div className="space-y-6">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle>Daily Responsibilities</CardTitle>
              <CardDescription>Recurring tasks that appear in an employee's daily to-do checklist.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 font-semibold">Name</th>
                    <th scope="col" className="px-6 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dailyTasks.map(task => (
                    <tr key={task.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-3 font-medium text-slate-900">{task.name}</td>
                      <td className="px-6 py-3 text-right">
                        <form action={deleteDailyResponsibilityAction.bind(null, task.id)}>
                          <DeleteButton itemName="Daily Responsibility" />
                        </form>
                      </td>
                    </tr>
                  ))}
                  {dailyTasks.length === 0 && (
                    <tr>
                      <td colSpan={2} className="px-6 py-6 text-center text-slate-500">No daily responsibilities defined.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="p-6 border-t border-slate-100 bg-slate-50/30">
                <h4 className="text-sm font-semibold mb-3">Add New Daily Responsibility</h4>
                <AddDailyResponsibilityForm />
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
