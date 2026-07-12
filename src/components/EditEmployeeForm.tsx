"use client";

import { useActionState } from "react";
import { editEmployeeAction } from "@/actions/employee.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, UserCog } from "lucide-react";
import Link from "next/link";

export function EditEmployeeForm({ 
  employee,
  projectRoles, 
  dailyResponsibilities,
  assignedProjectRoles,
  assignedDailyResponsibilities
}: { 
  employee: any,
  projectRoles: any[], 
  dailyResponsibilities: any[],
  assignedProjectRoles: string[],
  assignedDailyResponsibilities: string[]
}) {
  const editActionWithId = editEmployeeAction.bind(null, employee.id);
  const [state, formAction, isPending] = useActionState(editActionWithId, undefined);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/employees">
          <Button variant="outline" size="icon" className="bg-white border-slate-200 hover:bg-slate-50 text-slate-700">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Edit Employee</h2>
          <p className="text-slate-500">Update {employee.name}'s details.</p>
        </div>
      </div>

      <form action={formAction}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white border-slate-200 text-slate-900 shadow-sm rounded-xl md:col-span-1">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="flex items-center text-lg font-bold">
                <UserCog className="w-5 h-5 mr-2 text-blue-600" />
                Account Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              {state?.error && (
                <div className="p-3 text-sm text-red-700 bg-red-50 rounded-md border border-red-200">
                  {state.error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-medium">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={employee.name}
                  required
                  className="bg-white border-slate-300 focus-visible:ring-blue-500 text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-slate-700 font-medium">WhatsApp Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  defaultValue={employee.phoneNumber || ""}
                  placeholder="+919876543210"
                  className="bg-white border-slate-300 focus-visible:ring-blue-500 text-slate-900"
                />
                <p className="text-xs text-slate-500">Include country code for WhatsApp task assignments.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={employee.email}
                  required
                  className="bg-white border-slate-300 focus-visible:ring-blue-500 text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">New Password (Optional)</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Leave blank to keep current password"
                  className="bg-white border-slate-300 focus-visible:ring-blue-500 text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-slate-700 font-medium">System Access Level</Label>
                <select
                  id="role"
                  name="role"
                  required
                  defaultValue={employee.role}
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 text-slate-900"
                >
                  <option value="EMPLOYEE">EMPLOYEE</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                <p className="text-xs text-slate-500">Admins have full access. Employees only see their tasks.</p>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-1 space-y-6">
            <Card className="bg-white border-slate-200 text-slate-900 shadow-sm rounded-xl">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="text-lg font-bold">Project Roles</CardTitle>
                <CardDescription>Select all roles this employee can perform.</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 h-64 overflow-y-auto">
                <div className="space-y-3">
                  {projectRoles.map(role => (
                    <label key={role.id} className="flex items-start space-x-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="projectRoles" 
                        value={role.id} 
                        defaultChecked={assignedProjectRoles.includes(role.id)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900">{role.name}</span>
                        {role.description && <span className="text-xs text-slate-500">{role.description}</span>}
                      </div>
                    </label>
                  ))}
                  {projectRoles.length === 0 && <p className="text-sm text-slate-500">No roles defined.</p>}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 text-slate-900 shadow-sm rounded-xl">
              <CardHeader className="border-b border-slate-100 pb-4">
                <CardTitle className="text-lg font-bold">Daily Responsibilities</CardTitle>
                <CardDescription>Select recurring tasks for their daily checklist.</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 h-64 overflow-y-auto">
                <div className="space-y-3">
                  {dailyResponsibilities.map(task => (
                    <label key={task.id} className="flex items-start space-x-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="dailyResponsibilities" 
                        value={task.id} 
                        defaultChecked={assignedDailyResponsibilities.includes(task.id)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900">{task.name}</span>
                        {task.description && <span className="text-xs text-slate-500">{task.description}</span>}
                      </div>
                    </label>
                  ))}
                  {dailyResponsibilities.length === 0 && <p className="text-sm text-slate-500">No responsibilities defined.</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <Link href="/dashboard/employees">
            <Button type="button" variant="ghost" className="hover:bg-slate-200 text-slate-700">
              Cancel
            </Button>
          </Link>
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
