"use client";

import React from "react";
import Image from "next/image";

type icon = string;

const IconRenderer2 = ({
  icon,
  className,
}: {
  icon: icon;
  className?: string;
}) => {
  return (
    <Image
      src={icon ? icon : "/cross-supplier.svg"}
      width={18}
      height={12}
      alt="Custom Icon"
      className={`${className ? className : "h-4 w-4"}`}
    />
  );
};

export default IconRenderer2;
