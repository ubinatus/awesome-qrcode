import { useRef } from "react";
import { Button } from "@/components/ui/button";

import { AwesomeQRCode, type AwesomeQRCodeRef } from "@awesome-qrcode/react";

export function DownloadDemo() {
  // Ref
  const awesomeQRCodeRef = useRef<AwesomeQRCodeRef>(null);
  // Handler
  function download() {
    if (awesomeQRCodeRef.current) {
      const url = awesomeQRCodeRef.current.getUrl();
      if (url) {
        const link = document.createElement("a");
        link.href = url;
        link.download = "Awesome QRCode.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }
  return (
    <>
      <AwesomeQRCode
        ref={awesomeQRCodeRef}
        value="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        size={200}
      />
      <Button className="mt-4" onClick={download}>
        Download QRCode
      </Button>
    </>
  );
}
