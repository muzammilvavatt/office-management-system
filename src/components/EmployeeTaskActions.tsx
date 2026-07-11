"use client";

import { Button } from "@/components/ui/button";
import { startTaskAction, completeTaskAction, requestTimeExtensionAction } from "@/actions/task.actions";
import { Play, Check, Clock, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

export function EmployeeTaskActions({ taskId, status, allottedHours }: { taskId: string, status: string, allottedHours: number | null }) {
  const [isRequesting, setIsRequesting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [activeAction, setActiveAction] = useState<string | null>(null);

  if (status === "COMPLETED") {
    return <span className="text-sm font-bold text-green-600 flex items-center"><Check className="w-4 h-4 mr-1"/> Completed</span>;
  }

  if (status === "TIME_EXTENSION_REQUESTED") {
    return <span className="text-sm font-medium text-amber-600">Extension Pending...</span>;
  }

  const handleStartTask = () => {
    setActiveAction("START");
    startTransition(async () => {
      await startTaskAction(taskId);
      setActiveAction(null);
    });
  };

  const handleCompleteTask = () => {
    setActiveAction("COMPLETE");
    startTransition(async () => {
      await completeTaskAction(taskId);
      setActiveAction(null);
    });
  };

  const handleRequestExtension = (formData: FormData) => {
    setActiveAction("EXTEND");
    startTransition(async () => {
      await requestTimeExtensionAction(taskId, formData);
      setIsRequesting(false);
      setActiveAction(null);
    });
  };

  return (
    <div className="flex flex-col gap-2 w-full sm:w-auto">
      {status === "PENDING" && (
        <Button 
          onClick={handleStartTask} 
          disabled={isPending} 
          size="sm" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isPending && activeAction === "START" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
          {isPending && activeAction === "START" ? "Starting..." : "Start Task"}
        </Button>
      )}

      {status === "IN_PROGRESS" && (
        <>
          <Button 
            onClick={handleCompleteTask} 
            disabled={isPending} 
            size="sm" 
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {isPending && activeAction === "COMPLETE" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
            {isPending && activeAction === "COMPLETE" ? "Completing..." : "Complete Task"}
          </Button>

          {!isRequesting ? (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="w-full text-amber-600 border-amber-200 hover:bg-amber-50"
              onClick={() => setIsRequesting(true)}
              disabled={isPending}
            >
              <Clock className="w-4 h-4 mr-2" />
              Request More Time
            </Button>
          ) : (
            <form action={handleRequestExtension} className="flex flex-col gap-2 mt-2 p-3 bg-amber-50 border border-amber-100 rounded-md">
              <p className="text-xs font-semibold text-amber-800">Request Extension</p>
              <input 
                type="number" 
                name="hours" 
                min="1" 
                required 
                placeholder="Extra hours needed..."
                className="h-8 text-sm rounded border px-2 border-amber-200"
                disabled={isPending}
              />
              <textarea 
                name="reason" 
                required 
                placeholder="Why do you need more time?"
                className="text-sm rounded border p-2 border-amber-200 h-16"
                disabled={isPending}
              />
              <div className="flex gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsRequesting(false)} disabled={isPending} className="flex-1 h-8 text-slate-500">Cancel</Button>
                <Button type="submit" size="sm" disabled={isPending} className="flex-1 h-8 bg-amber-500 hover:bg-amber-600 text-white">
                  {isPending && activeAction === "EXTEND" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}
                </Button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}
