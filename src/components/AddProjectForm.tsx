"use client";

import { useActionState } from "react";
import { createProjectAction } from "@/actions/project.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Building2, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function AddProjectForm() {
  const [state, formAction, isPending] = useActionState(createProjectAction, undefined);

  return (
              />
            </div>

            <div className="space-y-2 col-span-1 md:col-span-2">
              <Label htmlFor="description" className="text-slate-700 font-medium">Description / Notes</Label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 text-slate-900 placeholder:text-slate-400"
                placeholder="Details about the project..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-slate-700 font-medium">Priority</Label>
              <select
                id="priority"
                name="priority"
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-slate-900"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-slate-700 font-medium">Deadline</Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                className="bg-white border-slate-300 focus-visible:ring-blue-500 block text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Workflow Builder Section */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">2. Automated Task Sequence</h3>
              <p className="text-sm text-slate-500">Define the series of tasks for this project. They will be linked sequentially.</p>
            </div>
            <Button type="button" onClick={addStep} size="sm" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200">
              <Plus className="w-4 h-4 mr-2" />
              Add Task Step
            </Button>
          </div>

          <input type="hidden" name="workflowSteps" value={JSON.stringify(steps)} />

          <div className="space-y-3">
            {steps.length === 0 ? (
              <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-500">
                <p>No tasks defined yet.</p>
                <p className="text-sm mt-1">Click "Add Task Step" to start building your workflow.</p>
              </div>
            ) : (
              steps.map((step, index) => (
                <div key={step.id} className="flex flex-col md:flex-row items-start md:items-center gap-3 p-4 bg-white border border-slate-200 shadow-sm rounded-xl">
                  
                  <div className="flex flex-col items-center justify-center space-y-1 mr-2 opacity-50">
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveStep(index, 'up')} disabled={index === 0}>
                      <span className="text-xs">▲</span>
                    </Button>
                    <span className="text-xs font-bold text-slate-400">#{index + 1}</span>
                    <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveStep(index, 'down')} disabled={index === steps.length - 1}>
                      <span className="text-xs">▼</span>
                    </Button>
                  </div>

                  <div className="flex-1 w-full space-y-1">
                    <Label className="text-xs text-slate-500">Task Name *</Label>
                    <Input 
                      placeholder="Task name" 
                      value={step.name} 
                      onChange={(e) => updateStep(step.id, 'name', e.target.value)} 
                      required
                      className="h-9 text-sm border-slate-300"
                    />
                  </div>

                  <div className="flex-1 w-full space-y-1">
                    <Label className="text-xs text-slate-500">Category *</Label>
                    <select
                      value={step.category}
                      onChange={(e) => updateStep(step.id, 'category', e.target.value)}
                      required
                      className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-slate-900"
                    >
                      {TASK_CATEGORIES.map(c => (
                        <option key={c} value={c}>{c.replace(/_/g, " ")}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 w-full space-y-1">
                    <Label className="text-xs text-slate-500">Assignee *</Label>
                    <select
                      value={step.assigneeId}
                      onChange={(e) => updateStep(step.id, 'assigneeId', e.target.value)}
                      required
                      className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-slate-900"
                    >
                      <option value="">Select Employee...</option>
                      {employees.map(e => (
                        <option key={e.id} value={e.id}>{e.name}</option>
                      ))}
                    </select>
                  </div>

                  <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50 self-end md:self-auto mb-1 md:mb-0 mt-6 md:mt-0" onClick={() => removeStep(step.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-4 border-t border-slate-100 pt-6 bg-slate-50 rounded-b-xl mt-4">
        <Link href="/dashboard/projects">
          <Button type="button" variant="ghost" className="hover:bg-slate-200 text-slate-700">
            Cancel
          </Button>
        </Link>
        <Button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create Project & Workflow"}
        </Button>
      </CardFooter>
    </form>
  );
}
