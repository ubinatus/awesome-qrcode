"use client";

import { AwesomeQRCode } from "@awesome-qrcode/react";

export function Demo() {
  return (
    <AwesomeQRCode
      value="NextJS is amazing!!"
      dataStyle="dots"
      size={175}
      eyeRadius={{
        inner: 0,
        outer: 6,
      }}
      logoImage="https://assets.vercel.com/image/upload/front/favicon/vercel/120x120.png"
      logoHeight={40}
      logoWidth={40}
      logoOpacity={1}
    />
  );
}
