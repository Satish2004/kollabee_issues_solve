"use client";
import { LoginForm } from "../../../../components/auth/login-form";

export default function BuyerLoginPage() {
  return (
    <div
      className="h-screen p-10 flex items-center justify-center"
      style={{
        background:
          "linear-gradient(to bottom right,#fce2eb, #edcbd7, #f0d6c6, #ffe7bf)",
      }}
    >
      <div className="bg-white w-full h-full rounded-xl flex flex-col items-center justify-center">
        <LoginForm message={"Login as buyer"} />
      </div>
    </div>
  );
}
