"use client";

import { Button } from "@/components/ui/button";
import { startTaskAction, submitForReviewAction, requestTimeExtensionAction } from "@/actions/task.actions";
import { Play, Check, Clock, Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

function TaskTimer({ timeSpentMs, lastTimerStart, allottedHours }: { timeSpentMs: number; lastTimerStart: Date | string | null; allottedHours: number }) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      let activeMs = timeSpentMs;
      if (lastTimerStart) {
        activeMs += Date.now() - new Date(lastTimerStart).getTime();
      }
      
      const allottedMs = allottedHours * 60 * 60 * 1000;
      const diff = allottedMs - activeMs;
      
      if (diff < 0) {
        setIsOverdue(true);
        const overMs = Math.abs(diff);
        const h = Math.floor(overMs / 3600000).toString().padStart(2, '0');
        const m = Math.floor((overMs % 3600000) / 60000).toString().padStart(2, '0');
        const s = Math.floor((overMs % 60000) / 1000).toString().padStart(2, '0');
        setTimeLeft(`-${h}:${m}:${s}`);
      } else {
        setIsOverdue(false);
        const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        setTimeLeft(`${h}:${m}:${s}`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [timeSpentMs, lastTimerStart, allottedHours]);

  if (!timeLeft) return null;

  return (
    <div className={`flex items-center text-xs font-bold px-3 py-1.5 rounded-md border ${isOverdue ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-50 text-slate-700 border-slate-200'} mb-2 w-full justify-center`}>
      <Clock className="w-3.5 h-3.5 mr-1.5" />
      {isOverdue ? 'Overdue: ' : 'Time Left: '} {timeLeft}
      {!lastTimerStart && <span className="ml-2 text-amber-600">(Paused)</span>}
    </div>
  );
}

export function EmployeeTaskActions({ taskId, status, allottedHours, timeSpentMs = 0, lastTimerStart, isClockedIn }: { taskId: string, status: string, allottedHours: number | null, timeSpentMs?: number, lastTimerStart?: string | Date | null, isClockedIn?: boolean }) {
  const [isRequesting, setIsRequesting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [activeAction, setActiveAction] = useState<string | null>(null);

  if (status === "COMPLETED") {
    return <span className="text-sm font-bold text-green-600 flex items-center"><Check className="w-4 h-4 mr-1"/> Completed</span>;
  }

  if (status === "REVIEW") {
    return <span className="text-sm font-bold text-purple-600 flex items-center"><Check className="w-4 h-4 mr-1"/> Pending Review</span>;
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

  const handleSubmitReview = () => {
    setActiveAction("REVIEW");
    startTransition(async () => {
      await submitForReviewAction(taskId);
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
      {!isClockedIn && (status === "PENDING" || status === "IN_PROGRESS") && (
        <div className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200 mb-1 text-center">
          Please clock in to work on tasks
        </div>
      )}

      {status === "PENDING" && (
        <Button 
          onClick={handleStartTask} 
          disabled={isPending || !isClockedIn} 
          size="sm" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isPending && activeAction === "START" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
          {isPending && activeAction === "START" ? "Starting..." : "Start Task"}
        </Button>
      )}

      {status === "IN_PROGRESS" && (
        <>
          {allottedHours !== null && <TaskTimer timeSpentMs={timeSpentMs} lastTimerStart={lastTimerStart ?? null} allottedHours={allottedHours} />}
          <Button 
            onClick={handleSubmitReview} 
            disabled={isPending || !isClockedIn} 
            size="sm" 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isPending && activeAction === "REVIEW" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
            {isPending && activeAction === "REVIEW" ? "Submitting..." : "Submit for Review"}
          </Button>

          {!isRequesting ? (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              className="w-full text-amber-600 border-amber-200 hover:bg-amber-50"
              onClick={() => setIsRequesting(true)}
              disabled={isPending || !isClockedIn}
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
                min="0" 
                step="any"
                required 
                placeholder="Extra time (e.g. 0.5 for 30m)..."
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
