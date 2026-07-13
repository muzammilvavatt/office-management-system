import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 rounded-xl bg-white shadow-sm ring-1 ring-slate-200 flex items-center justify-center animate-pulse">
        <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
      </div>
      <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading workspace...</p>
    </div>
  );
}
