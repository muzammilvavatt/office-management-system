"use client";

import { useActionState } from "react";
import { createTaskAction } from "@/actions/task.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const TASK_CATEGORIES = [
  "SITE_INSPECTION",
  "SITE_PLAN",
  "FLOOR_PLAN",
  "RULE_CHART",
  "NOC_FIRE",
  "NOC_PCB",
  "NOC_RTP",
  "DOCUMENTATION",
  "OTHER"
];

export function AddTaskForm({ projects, employees, tasks = [] }: { projects: any[], employees: any[], tasks?: any[] }) {
  const [state, formAction, isPending] = useActionState(createTaskAction, undefined);
  const router = useRouter();

  // If we have a success state, show a success UI instead of the form.
  if (state?.success) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2 shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Task Created Successfully!</h2>
          <p className="text-slate-500 mt-2 max-w-md">The task has been saved to the database and assigned to the selected employee.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
          {state.whatsappUrl && (
            <a 
              href={state.whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => router.push("/dashboard/tasks")}
              className="inline-flex h-10 items-center justify-center rounded-md bg-green-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-700"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Notify via WhatsApp
            </a>
          )}
          <Button 
            variant="outline" 
            onClick={() => router.push("/dashboard/tasks")}
            className="border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            Go to Task List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction}>
      <CardContent className="space-y-6 pt-6">
        {state?.error && (
          <div className="p-4 text-sm text-rose-700 bg-rose-50 rounded-xl border border-rose-200 font-medium">
            {state.error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5 col-span-1 md:col-span-2">
            <Label htmlFor="name" className="text-sm font-semibold text-slate-700">Task Title <span className="text-rose-500">*</span></Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Conduct Initial Site Survey"
              required
              className="bg-white border-slate-300 focus-visible:ring-indigo-500 text-slate-900 rounded-xl h-11"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="projectId" className="text-sm font-semibold text-slate-700">Project <span className="text-rose-500">*</span></Label>
            <select
              id="projectId"
              name="projectId"
              required
              className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 text-slate-900"
            >
              <option value="">Select a Project...</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name} — {p.clientName}</option>
              ))}
            </select>
            {projects.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">Please create a project first!</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category" className="text-sm font-semibold text-slate-700">Category <span className="text-rose-500">*</span></Label>
            <select
              id="category"
              name="category"
              required
              className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 text-slate-900"
            >
              <option value="">Select Category...</option>
              {TASK_CATEGORIES.map(c => (
                <option key={c} value={c}>{c.replace(/_/g, " ")}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="assigneeId" className="text-sm font-semibold text-slate-700">Assign To <span className="text-rose-500">*</span></Label>
            <select
              id="assigneeId"
              name="assigneeId"
              required
              className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 text-slate-900"
            >
              <option value="">Select Employee...</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.name} ({e.role.replace(/_/g, " ")})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="priority" className="text-sm font-semibold text-slate-700">Priority</Label>
            <select
              id="priority"
              name="priority"
              className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 text-slate-900"
            >
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="allottedHours" className="text-sm font-semibold text-slate-700">Allotted Time (Hours) <span className="text-rose-500">*</span></Label>
            <Input
              id="allottedHours"
              name="allottedHours"
              type="number"
              step="any"
              min="0"
              required
              placeholder="e.g. 4"
              className="bg-white border-slate-300 focus-visible:ring-indigo-500 text-slate-900 rounded-xl h-11"
            />
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="dependsOnId" className="text-sm font-semibold text-slate-700">Depends On <span className="text-slate-400 font-normal">(Optional)</span></Label>
            <select
              id="dependsOnId"
              name="dependsOnId"
              className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 text-slate-900"
            >
              <option value="">No Dependencies</option>
              {tasks.map(t => (
                <option key={t.id} value={t.id}>[{t.project.name}] {t.name}</option>
              ))}
            </select>
            <p className="text-xs text-slate-400">This task will remain locked until the selected task is completed.</p>
          </div>

          <div className="space-y-1.5 col-span-1 md:col-span-2">
            <Label htmlFor="notes" className="text-sm font-semibold text-slate-700">Task Notes</Label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              className="flex w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 text-slate-900 placeholder:text-slate-400 resize-y"
              placeholder="Instructions, context, or requirements for the employee..."
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-3 border-t border-slate-100 pt-6 bg-slate-50/50 rounded-b-xl">
        <Link href="/dashboard/tasks">
          <Button type="button" variant="outline" className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50">
            Cancel
          </Button>
        </Link>
        <Button 
          type="submit" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm min-w-[130px]"
          disabled={projects.length === 0 || employees.length === 0 || isPending}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Assigning…
            </span>
          ) : "Assign Task"}
        </Button>
      </CardFooter>
    </form>
  );
}
