"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export function DeleteButton({ itemName = "item" }: { itemName?: string }) {
  const { pending } = useFormStatus();
  
  return (
    <Button 
      type="submit" 
      variant="ghost" 
      size="sm"
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
      title={`Delete ${itemName}`}
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(`Are you sure you want to delete this ${itemName}? This action cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
