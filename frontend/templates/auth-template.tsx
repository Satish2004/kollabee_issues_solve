"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Users } from "lucide-react";
import { Card } from "../components/ui/card";

export default function AuthTemplate({
  welcomeMessage,
  buyerUrl,
  sellerUrl,
  footerMessage,
  footerLink,
  linkTitle,
}) {
  return (
    <div
      className="h-screen p-10"
      style={{
        background:
          "linear-gradient(to bottom right,#fce2eb, #edcbd7, #f0d6c6, #ffe7bf)",
      }}
    >
      <div className="bg-white rounded-xl shadow-sm w-full h-[90vh]">
        <div className="py-12 px-4 h-full flex items-center justify-center">
          <div className="mx-auto flex flex-col justify-center space-y-6 max-w-[700px]">
            <div className="flex flex-col space-y-4 text-center">
              <Link href="/">
                <Image
                  src="https://res.cloudinary.com/dodniqtyv/image/upload/f_auto,q_auto/w0knrjcs0l7mqswxuway"
                  alt="KollaBee Logo"
                  width={160}
                  height={42}
                  className="mx-auto mb-8"
                />
              </Link>
              <h1 className="font-futura font-extrabold text-2xl md:text-4xl lg:text-5xl">
                {welcomeMessage}
              </h1>
              <p className="font-futura font-normal text-base text-muted-foreground">
                Select Account Type
              </p>
            </div>

            <div className="flex flex-col  md:flex-row gap-6 w-full font-futra items-center justify-center">
              <Link href={buyerUrl} className="w-1/3">
                <Card className=" hover:bg-accent gradient-border-auth h-full shadow-none">
                  <div className="flex flex-col items-center space-y-4 p-8">
                    <div className="rounded-full bg-pink-50 p-5 dark:bg-pink-900/20">
                      <ShoppingCart className="h-10 w-10 text-pink-500" />
                    </div>
                    <h2 className="text-2xl font-futura font-normal">Buyer</h2>
                    <p className="text-center text-[15px] text-neutral-500">
                      Discover trusted suppliers & services to bring your ideas
                      to life
                    </p>
                  </div>
                </Card>
              </Link>

              <Link href={sellerUrl} className="w-1/3">
                <Card className=" hover:bg-accent shadow-none gradient-border-auth  h-full">
                  <div className="p-8 flex flex-col items-center space-y-4">
                    <div className="rounded-full bg-pink-50 p-5 dark:bg-pink-900/20">
                      <Users className="h-10 w-10 text-pink-500" />
                    </div>
                    <h2 className="text-2xl font-futura font-normal">
                      Supplier
                    </h2>
                    <p className="text-center font-futra font-normal text-[15px] text-neutral-500">
                      Showcase your products & services - connect with potential
                      buyers
                    </p>
                  </div>
                </Card>
              </Link>
            </div>

            <hr className="w-[130%] translate-x-[-12%] border-neutral-300 translate-y-2 " />

            <p className="text-center text-[15px] text-muted-foreground font-futura">
              {footerMessage} <br></br>
              <Link
                href={footerLink}
                className="text-pink-600 hover:text-pink-500 font-futura font-normal border-b border-pink-600"
              >
                {linkTitle}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
