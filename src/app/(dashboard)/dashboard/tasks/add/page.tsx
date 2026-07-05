import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CheckSquare } from "lucide-react";
import Link from "next/link";
import { AddTaskForm } from "@/components/AddTaskForm";

export default async function AddTaskPage() {
  const projects = await prisma.project.findMany({
    where: { status: "ACTIVE" },
    orderBy: { name: "asc" }
  });

  const employees = await prisma.user.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" }
  });

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10">
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/tasks">
          <Button variant="outline" size="icon" className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Assign Task</h2>
          <p className="text-zinc-400">Delegate work to your team members.</p>
        </div>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 text-zinc-100">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckSquare className="w-5 h-5 mr-2 text-blue-500" />
            Task Details
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Define the scope, priority, and who is responsible.
          </CardDescription>
        </CardHeader>
        <AddTaskForm projects={projects} employees={employees} />
      </Card>
    </div>
  );
}
