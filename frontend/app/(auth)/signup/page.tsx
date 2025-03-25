"use client";

import AuthTemplate from "@/templates/auth-template";

export default function SignupPage() {
  return (
    <div>
      <AuthTemplate welcomeMessage={"Join Kollabee – The Hive for Collaboration"} sellerUrl={"/signup/seller"} buyerUrl={"/signup/buyer"} footerMessage={"Already have an account?"} footerLink={"/login"} linkTitle={"Log in"} />
    </div>
  );
}