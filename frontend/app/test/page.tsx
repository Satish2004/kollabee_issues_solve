"use client";

import React from "react";
import CountryList from "country-list-with-dial-code-and-flag";

const page = () => {
  const countries = CountryList.getAllCountries(); 
  console.log("Countries:", countries);

  return (
    <div>
      {countries &&
        countries.map((country) => (
          <div key={country.code} className="flex items-center">
            <span className="mr-2">{country.flag}</span>
            <span className="mr-2">{country.name}</span>
            <span>{country.dialCode}</span>
          </div>
        ))}
    </div>
  );
};

export default page;
