"use client";
import { LoginForm } from "../../../../components/auth/login-form";

export default function BuyerLoginPage() {
  return (
    <div className="h-screen p-10 flex items-center justify-center" style={{
      background: "linear-gradient(to bottom right,#fce2eb, #edcbd7, #f0d6c6, #ffe7bf)"
    }}>
      <div className="bg-white w-full h-full flex flex-col items-center justify-center">
      <h1 className="text-2xl mb-4 font-semibold">Login as Supplier</h1>
      <LoginForm  />
      </div>
    </div>
  )
}
