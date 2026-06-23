import { compactSelectClassName, formControlClassName } from "@/lib/form-control";
import { cn } from "@/lib/cn";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  compact?: boolean;
};

export function Select({ className, compact = false, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(compact ? compactSelectClassName : formControlClassName, className)}
      {...props}
    >
      {children}
    </select>
  );
}
