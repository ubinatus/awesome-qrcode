import React from "react";
import { useClipboard } from "@/lib/useClipboard";
import { cn } from "@/lib/utils";
import { Popover } from "@headlessui/react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { Button } from "./ui/button";

export const CopyCode = () => {
  // State
  const [copyCommand, setCopyCommand] = React.useState(
    "npm install @awesome-qrcode/react",
  );
  // Hooks
  const { hasCopied, onCopy } = useClipboard();

  // Lifecycle
  React.useEffect(() => {
    if (hasCopied) {
      // codeRef.current.click();
    }
  }, [hasCopied]);

  // Handlers
  const handleCopy = (value: string) => {
    let command = "";
    switch (value) {
      case "npm":
        command = "npm install @awesome-qrcode/react";
        break;
      case "yarn":
        command = "yarn add @awesome-qrcode/react";
        break;
      case "pnpm":
        command = "pnpm add @awesome-qrcode/react";
        break;
      default:
        break;
    }
    setCopyCommand(command);
    void onCopy(command);
  };

  return (
    <div className="flex w-full items-center justify-between gap-2 rounded-xl bg-gray-200 py-2 pl-4 pr-3 dark:bg-gray-800 md:max-w-[420px]">
      <code className="sm:text-md text-base md:text-lg">{copyCommand}</code>
      <Popover>
        {({ close }) => (
          /* Use the `open` state to conditionally change the direction of the chevron icon. */
          <>
            <Popover.Button as="div" className="cursor-pointer">
              {hasCopied ? (
                <CheckIcon className="h-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <CopyIcon className="h-5 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300" />
              )}
            </Popover.Button>
            <Popover.Panel className="absolute z-10 m-2 -ml-4">
              <div
                className={cn(
                  "rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-50 dark:bg-popover-foreground",
                  "flex max-w-[64px] flex-col p-0",
                )}
              >
                <Button
                  variant="ghost"
                  className="h-8 rounded-none py-0 !leading-tight"
                  onClick={() => {
                    close();
                    handleCopy("npm");
                  }}
                >
                  npm
                </Button>
                <Button
                  variant="ghost"
                  className="h-8 rounded-none py-0 !leading-tight"
                  onClick={() => {
                    close();
                    handleCopy("yarn");
                  }}
                >
                  yarn
                </Button>
                <Button
                  variant="ghost"
                  className="h-8 rounded-none py-0 !leading-tight"
                  onClick={() => {
                    close();
                    handleCopy("pnpm");
                  }}
                >
                  pnpm
                </Button>
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
    </div>
  );
};
