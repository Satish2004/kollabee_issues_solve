"use client";

import React, { ElementType } from "react";
import Image from "next/image";

type IconType = ElementType | "custom";

const IconRenderer = ({
  icon,
  className,
}: {
  icon: IconType;
  className: string;
}) => {
  if (icon === "custom") {
    return (
      <Image
        src="/cross-supplier.svg"
        width={18}
        height={12}
        alt="Custom Icon"
        className={`${className ? className : "h-4 w-4"}`}
      />
    );
  }

  const IconComponent = icon as ElementType;
  return <IconComponent className={`${className ? className : "h-4 w-4"}`} />;
};

export default IconRenderer;
