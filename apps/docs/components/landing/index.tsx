import { useRef, useState, type ReactNode } from "react";
import { CopyCode } from "@/components/copy-code";
import { QRForm } from "@/components/qr-form";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/lib/fade-in";
import { defaultValues } from "@/lib/form";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

import {
  AwesomeQRCode,
  type AwesomeQRCodeProps,
  type AwesomeQRCodeRef,
} from "@awesome-qrcode/react";

import styles from "./index.module.css";

const variants = {
  hidden: { opacity: 0 },
  active: { opacity: 1 },
};

function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const [hovering, setHovering] = useState(false);
  return (
    <div
      className={cn(
        styles["counter-border"],
        "h-[304]px w-[calc(100%_-_0px)] sm:h-[352px] sm:!w-[488px]",
      )}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <motion.i
        initial="hidden"
        animate={hovering ? "active" : "hidden"}
        variants={variants}
        aria-hidden="true"
      />
      <div
        className={cn(
          "flex h-full w-full max-w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-[rgba(255,255,255,0.05)] p-3 !pb-12 pt-8 md:!pb-4 md:!pt-4",
          className,
        )}
      >
        <div className="flex flex-1 flex-col items-center">{children}</div>
      </div>
    </div>
  );
}

function SiteCards() {
  // Ref
  const awesomeQRCodeRef = useRef<AwesomeQRCodeRef>(null);
  // State
  const [options, setOptions] = useState<AwesomeQRCodeProps>(defaultValues);

  // Downloading the QRCode
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
    <div className="lg:!my-15 my-8 flex w-full flex-col items-center justify-center gap-6 px-6 sm:mx-0 md:!my-14 md:mb-0 lg:!translate-y-0 lg:!flex-row">
      <Card>
        <div className="flex h-full flex-col flex-wrap items-center justify-center gap-4">
          <AwesomeQRCode ref={awesomeQRCodeRef} {...options} />
          <Button variant="outline" onClick={download}>
            Download QR Code
          </Button>
        </div>
      </Card>
      <div className="relative max-w-lg">
        <QRForm setOptions={(val) => setOptions(val)} />
      </div>
    </div>
  );
}

function LandingPage() {
  return (
    <FadeIn className="relative flex h-full w-full flex-col items-center justify-center">
      <h1 className="mx-6 mt-12 w-[300px] bg-gradient-to-b from-black/60 to-black bg-clip-text  text-center text-5xl font-extrabold leading-tight text-transparent dark:from-white dark:to-[#AAAAAA] md:!w-full lg:text-6xl xl:leading-snug">
        Awesome QRCode
      </h1>
      <p className="font-space-grotesk mx-6 my-3 max-h-[112px] w-[315px] text-center text-xl text-[#666666] dark:text-[#888888] md:max-h-[96px] md:w-[660px] md:text-2xl">
        Generate QRCodes for your website with a customized branding
      </p>
      <CopyCode />
      <SiteCards />
    </FadeIn>
  );
}

export default LandingPage;
