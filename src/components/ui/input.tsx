import { formControlClassName } from "@/lib/form-control";
import { cn } from "@/lib/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, type = "text", ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(formControlClassName, className)}
      {...props}
    />
  );
}
