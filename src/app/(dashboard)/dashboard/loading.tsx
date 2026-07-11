import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="p-4 bg-white rounded-full shadow-sm border border-slate-100 animate-pulse">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
      <p className="text-sm font-medium text-slate-500 animate-pulse">Loading dashboard...</p>
    </div>
  );
}
