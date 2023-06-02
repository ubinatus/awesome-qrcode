import { AwesomeQRCode } from "@awesome-qrcode/react";

export function AwesomeQRCodeDemo() {
  return (
    <AwesomeQRCode
      value="This is an Awesome QRCode"
      ecLevel="M"
      size={200}
      dataStyle="dots"
      eyeRadius={12}
      bgColor="#FFFFFF"
      fgColor="black"
      eyeColor="rgb(139,92,246)"
    />
  );
}
