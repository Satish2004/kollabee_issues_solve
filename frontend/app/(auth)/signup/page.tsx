"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function SignupPage() {
  return (
    <div className="h-screen p-10" style={{
      background: "linear-gradient(to bottom right,#fce2eb, #edcbd7, #f0d6c6, #ffe7bf)"
    }}>
      <div className="bg-white rounded-xl shadow-sm w-full h-[90vh]">
        <div className="py-12 px-4 h-full flex items-center justify-center">
          <div className="mx-auto flex flex-col justify-center space-y-6 max-w-[700px]">
            <div className="flex flex-col space-y-4 text-center">
              <Link href="/">
              <Image
                src="/kollabee.jpg"
                alt="KollaBee Logo"
                width={160}
                height={42}
                className="mx-auto mb-8"
              />
              </Link>
              <h1 className="text-[28px] font-bold tracking-tight">
                Join Kollabee – The Hive for Collaboration
              </h1>
              <p className="text-base text-muted-foreground">
                Select Account Type
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 w-full">
              <Link href="/signup/buyer" className="w-full">
                <Card className=" hover:bg-accent gradient-border h-full shadow-none">
                  <div className="flex flex-col items-center space-y-4 p-8">
                    <div className="rounded-full bg-pink-50 p-5 dark:bg-pink-900/20">
                      <ShoppingCart className="h-10 w-10 text-pink-500" />
                    </div>
                    <h2 className="text-2xl font-semibold">Buyer</h2>
                    <p className="text-center text-[15px] text-neutral-500">
                      Discover trusted suppliers & services to bring your ideas
                      to life
                    </p>
                  </div>
                </Card>
              </Link>

              <Link href="/signup/seller" className="w-full">
                <Card className=" hover:bg-accent shadow-none gradient-border h-full">
                  <div className="p-8 flex flex-col items-center space-y-4">
                    <div className="rounded-full bg-pink-50 p-5 dark:bg-pink-900/20">
                      <Users className="h-10 w-10 text-pink-500" />
                    </div>
                    <h2 className="text-2xl font-semibold">Supplier</h2>
                    <p className="text-center text-[15px] text-neutral-500">
                      Showcase your products & services - connect with potential
                      buyers
                    </p>
                  </div>
                </Card>
              </Link>
            </div>
            
            <hr className="w-[130%] translate-x-[-12%] border-neutral-300 translate-y-2 " />

            <p className="text-center text-[15px] text-muted-foreground">
              Already have an account?{" "} <br></br>
              <Link
                href="/login"
                className="text-pink-600 hover:text-pink-500 font-medium border-b border-pink-600"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}