import React from "react";
import Appointment from "@/components/appointment/Appointment";

const page = () => {
  return (
    <div className=" rounded-md bg-white  w-full h-full p-2">
      <div className=" rounded-lg">
        <Appointment />
      </div>
    </div>
  );
};

export default page;
