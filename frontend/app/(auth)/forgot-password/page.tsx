import { ForgotPasswordForm } from "@/components/auth/forget-password";

export default async function ForgotPasswordPage() {
  return (
    <div
      className="h-screen p-10 flex items-center justify-center"
      style={{
        background:
          "linear-gradient(to bottom right,#fce2eb, #edcbd7, #f0d6c6, #ffe7bf)",
      }}
    >
      <div className="bg-white w-full h-full rounded-xl flex flex-col items-center justify-center">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
