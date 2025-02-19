"use client";

import * as SwitchPrimitives from "@radix-ui/react-switch";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

type SwitchLoginProps = React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
  onValue: string;
  offValue: string;
  onToggle: (checked: boolean) => void; // Updated prop name
};

const SwitchLogin = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchLoginProps
>(({ className, onValue, offValue, onToggle, ...props }, ref) => {
  const [checked, setChecked] = React.useState(false);

  const handleSwitchChange = (checked: boolean) => {
    setChecked(checked);
    onToggle(checked); // Call the onToggle prop function
  };

  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-8 w-24 shrink-0 cursor-pointer items-center focus-visible:outline-none focus-visible:ring-2  disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
      ref={ref}
      checked={checked}
      onCheckedChange={handleSwitchChange}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none absolute bg-none ring-0 data-[state=unchecked]:translate-x-0 flex gap-1"
        )}
      >
        <Globe className="text-primary" />
        <p className="text-textColorSecond">{checked ? onValue : offValue}</p>
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  );
});

SwitchLogin.displayName = SwitchPrimitives.Root.displayName;

export { SwitchLogin };
