import React from "react";

const data = [
  {
    name: "value",
    type: "string",
    default: "Awesome QRCode",
    description: "The data to be encoded in the QR code.",
  },
  {
    name: "size",
    type: "number",
    default: "150",
    description: "The size of the QR code in pixels.",
  },
  {
    name: "dataStyle",
    type: "DataStyle",
    default: "squares",
    description: "The style of the QR code data modules.",
  },
  {
    name: "ecLevel",
    type: "ECLevel",
    default: "M",
    description: "The error correction level of the QR code.",
  },
  {
    name: "quietZone",
    type: "number",
    default: "10",
    description: "The size of the quiet zone around the QR code in pixels.",
  },
  {
    name: "bgColor",
    type: "string",
    default: "#FFFFFF",
    description: "The background color of the QR code.",
  },
  {
    name: "fgColor",
    type: "string",
    default: "#000000",
    description: "The color of the QR code modules.",
  },
  {
    name: "logoImage",
    type: "string",
    default: null,
    description:
      "The URL of the image to be displayed in the center of the QR code.",
  },
  {
    name: "logoWidth",
    type: "number",
    default: "40",
    description: "The width of the logo in pixels.",
  },
  {
    name: "logoHeight",
    type: "number",
    default: "40",
    description: "The height of the logo in pixels.",
  },
  {
    name: "logoOpacity",
    type: "number",
    default: "1",
    description: "The opacity of the logo. Ranges from 0 to 1.",
  },
  {
    name: "logoPadding",
    type: "number",
    default: "0",
    description: "The padding around the logo in pixels.",
  },
  {
    name: "logoRadiusStyle",
    type: "LogoRadiusStyle",
    default: null,
    description: "The shape of the padding around the logo.",
  },
  {
    name: "removeQrCodeBehindLogo",
    type: "boolean",
    default: null,
    description: "Whether to remove the QR code modules behind the logo.",
  },
  {
    name: "eyeRadius",
    type: "EyeRadius",
    default: "0",
    description: "The radius of the corners of the positioning eyes in pixels.",
  },
  {
    name: "eyeColor",
    type: "EyeColor",
    default: null,
    description: "The color of the positioning eyes.",
  },
  {
    name: "onLoad",
    type: "function",
    default: null,
    description: "The function to be called when the QR code has loaded.",
  },
  {
    name: "onError",
    type: "function",
    default: null,
    description:
      "The function to be called if there was an error loading the QR code.",
  },
];

type Props = { children: React.ReactNode };

function TR({ children }: Props) {
  return (
    <tr className="nx-m-0 nx-border-t nx-border-gray-300 nx-p-0 dark:nx-border-gray-600 even:nx-bg-gray-100 even:dark:nx-bg-gray-600/20">
      {children}
    </tr>
  );
}
function TH({ children }: Props) {
  return (
    <th className="nx-m-0 nx-border nx-border-gray-300 nx-px-4 nx-py-2 nx-font-semibold dark:nx-border-gray-600">
      {children}
    </th>
  );
}
function TD({ children }: Props) {
  return (
    <th className="nx-m-0 nx-border nx-border-gray-300 nx-px-4 nx-py-2 dark:nx-border-gray-600 font-normal">
      {children}
    </th>
  );
}

export function PropsTable() {
  return (
    <table className="nx-block nx-overflow-x-scroll nextra-scrollbar nx-mt-6 nx-p-0 first:nx-mt-0">
      <thead>
        <TR>
          <TH>Name</TH>
          <TH>Type</TH>
          <TH>Default</TH>
          <TH>Description</TH>
        </TR>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <TR key={index}>
            <TD>{row.name}</TD>
            <TD>{row.type}</TD>
            <TD>{row.default}</TD>
            <TD>{row.description}</TD>
          </TR>
        ))}
      </tbody>
    </table>
  );
}
