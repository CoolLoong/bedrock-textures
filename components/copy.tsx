import { useState } from "react";
import { Button, ButtonProps } from "@heroui/button";

import { CopyIcon, CheckIcon } from "@/components/icons";

interface CopyButtonProps extends ButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({
  text,
  className = "",
  ...buttonProps
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 500);
    });
  };

  return (
    <Button
      {...buttonProps}
      isIconOnly
      aria-label={isCopied ? "Copied!" : "Copy to clipboard"}
      className={`group relative overflow-hidden ${className}`}
      size="sm"
      variant="light"
      onPress={handleCopy}
    >
      <div className="relative h-4 w-4">
        <CopyIcon
          className={`transition-all duration-300 ${
            isCopied ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"
          }`}
          size={16}
        />

        <CheckIcon
          className={`absolute inset-0 text-green-500 transition-all duration-300 ${
            isCopied ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
          size={16}
        />
      </div>

      <span className="absolute inset-0 bg-gray-200 opacity-0 group-active:opacity-20 transition-opacity duration-200" />
    </Button>
  );
}
