import localFont from "next/font/local";

// Define all Futura font variants
export const futura = localFont({
  variable: "--font-futura",
  src: [
    {
      path: "../public/fonts/futura/futura light bt.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/futura/Futura Light Italic font.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/fonts/futura/Futura Book font.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/futura/Futura Book Italic font.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/futura/futura medium bt.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/futura/Futura Medium Italic font.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/futura/Futura Bold font.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/futura/Futura Bold Italic font.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../public/fonts/futura/Futura Heavy font.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../public/fonts/futura/Futura Heavy Italic font.ttf",
      weight: "800",
      style: "italic",
    },
    {
      path: "../public/fonts/futura/Futura Extra Black font.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../public/fonts/futura/Futura-CondensedLight.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/futura/futura medium condensed bt.ttf",
      weight: "500",
      style: "normal",
    },
  ],
});
