import * as z from "zod";

import { type DataStyle, type ECLevel } from "@awesome-qrcode/react";

export const defaultValues = {
  value: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  ecLevel: "M" as ECLevel,
  size: 200,
  bgColor: "#FFFFFF",
  fgColor: "#000000",
  logoImage:
    "https://assets.vercel.com/image/upload/front/favicon/vercel/120x120.png",
  removeQrCodeBehindLogo: false,
  eyeColor: "#000000",
  eyeRadius: 12,
  dataStyle: "squares" as DataStyle,
};

export const ecLevelOptions = [
  { value: "L", label: "L - Low (~7%)" },
  { value: "M", label: "M - Medium (~15%)" },
  { value: "Q", label: "Q - Quartile (~25%)" },
  { value: "H", label: "H - High (~30%)" },
];

export const formSchema = z
  .object({
    value: z.string(),
    ecLevel: z.enum(["L", "M", "Q", "H"]),
    bgColor: z.string(),
    fgColor: z.string(),
    size: z.number().default(150),
    logoImage: z.string(),
    logoHeight: z.number().default(50),
    logoWidth: z.number().default(50),
    logoOpacity: z.number().default(1),
    removeQrCodeBehindLogo: z.boolean(),
    eyeColor: z.string(),
    eyeRadius: z
      .string()
      .or(z.number())
      .transform((val) => Number(val))
      .refine(
        (x) => x !== null && !isNaN(x) && x >= 0,
        "Enter a nonnegative number",
      ),
    dataStyle: z.enum(["squares", "dots"]),
  })
  .required();

export type FormValues = z.infer<typeof formSchema>;
