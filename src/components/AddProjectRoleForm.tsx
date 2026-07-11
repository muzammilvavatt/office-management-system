"use client";

import { useActionState, useRef, useEffect } from "react";
import { createProjectRoleAction } from "@/actions/settings.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

export function AddProjectRoleForm() {
  const [state, formAction, isPending] = useActionState(createProjectRoleAction, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  // If successful, reset form
  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state?.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      {state?.error && <div className="text-xs text-red-600 bg-red-50 p-2 rounded">{state.error}</div>}
      <Input
        name="name"
        placeholder="Role Name (e.g. Site Plan)"
        required
        className="h-9 bg-white"
      />
      <Input
        name="description"
        placeholder="Optional Description"
        className="h-9 bg-white"
      />
      <Button type="submit" disabled={isPending} className="w-full bg-slate-800 hover:bg-slate-900 text-white h-9">
        <Plus className="w-4 h-4 mr-2" />
        {isPending ? "Adding..." : "Add Role"}
      </Button>
    </form>
  );
}
