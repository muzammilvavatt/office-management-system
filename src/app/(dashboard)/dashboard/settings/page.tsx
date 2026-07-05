"use client";

import { useActionState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Settings as SettingsIcon, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePasswordAction } from "@/actions/settings.actions";

export default function SettingsPage() {
  const [state, formAction, isPending] = useActionState(changePasswordAction, undefined);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h2>
        <p className="text-slate-500">Manage your account and preferences.</p>
      </div>

      <Card className="bg-white border-slate-200 text-slate-900 shadow-sm rounded-xl max-w-xl">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="flex items-center text-lg font-bold">
            <Lock className="w-5 h-5 mr-2 text-blue-600" />
            Change Password
          </CardTitle>
          <CardDescription className="text-slate-500">
            Ensure your account is using a long, random password to stay secure.
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="pt-6 space-y-4">
            {state?.error && (
              <div className="p-3 text-sm text-red-700 bg-red-50 rounded-md border border-red-200 font-medium">
                {state.error}
              </div>
            )}
            {state?.success && (
              <div className="p-3 text-sm text-green-700 bg-green-50 rounded-md border border-green-200 font-medium">
                {state.success}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                className="bg-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="bg-white"
              />
            </div>
          </CardContent>
          <CardFooter className="pb-6">
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              disabled={isPending}
            >
              {isPending ? "Updating..." : "Update Password"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
