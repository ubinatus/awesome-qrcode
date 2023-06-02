import * as React from "react";

export function useClipboard(timeout = 750) {
  const [hasCopied, setHasCopied] = React.useState(false);

  const onCopy = async (valueState: string) => {
    try {
      await navigator.clipboard.writeText(valueState);
      setHasCopied(true);
    } catch (error) {
      console.error("Failed to copy command:", error);
      setHasCopied(false);
    }
  };

  React.useEffect(() => {
    let timeoutId: number | null = null;

    if (hasCopied) {
      timeoutId = window.setTimeout(() => {
        setHasCopied(false);
      }, timeout);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [timeout, hasCopied]);

  return {
    onCopy,
    hasCopied,
  };
}
