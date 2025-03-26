"use client";
import AuthTemplate from "../../../templates/auth-template";

export default function LoginPage() {
  return (
    <div>
      <AuthTemplate welcomeMessage={"Welcome Back! Let's get started"} sellerUrl={"/login/seller"} buyerUrl={"/login/buyer"} footerMessage={"Don't have an account?"} footerLink={"/signup"} linkTitle={"Sign Up"} />
    </div>
  )
}
