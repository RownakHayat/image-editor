import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const MultiSelectCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  {
    className?: string;
    value: string;
    checked: boolean;
    onChange: (value: string) => void;
  }
>(({ className, value, checked, onChange, ...props }, ref) => {
  const handleChange = () => {
    onChange(value);
  };

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className
      )}
      checked={checked}
      onCheckedChange={handleChange}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn("flex items-center justify-center text-current")}
      >
        <Check className="h-4 w-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});

MultiSelectCheckbox.displayName = CheckboxPrimitive.Root.displayName;

export { MultiSelectCheckbox };
