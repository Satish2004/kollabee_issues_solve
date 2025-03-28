"use client";
import React, { Suspense } from "react";
import { NewPasswordForm } from "../../../components/auth/reset-password";

export function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700">
      <NewPasswordForm />
    </div>
  );
}
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div
        className="h-screen p-10 flex items-center justify-center"
        style={{
          background:
            "linear-gradient(to bottom right,#fce2eb, #edcbd7, #f0d6c6, #ffe7bf)",
        }}
      >
        <div className="bg-white w-full h-full rounded-xl flex flex-col items-center justify-center">
          <NewPasswordForm />
        </div>
      </div>
    </Suspense>
  );
}
