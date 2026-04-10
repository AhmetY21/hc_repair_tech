"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";

type FormSubmitButtonProps = Omit<ButtonProps, "children" | "type"> & {
  idleLabel: string;
  pendingLabel?: string;
  idleIcon?: ReactNode;
  pendingIcon?: ReactNode;
};

export function FormSubmitButton({
  idleLabel,
  pendingLabel = "Kaydediliyor...",
  idleIcon,
  pendingIcon,
  disabled,
  ...props
}: FormSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={disabled || pending}
      aria-disabled={disabled || pending}
      {...props}
    >
      {pending ? (pendingIcon ?? <LoaderCircle className="size-4 animate-spin" />) : idleIcon}
      {pending ? pendingLabel : idleLabel}
    </Button>
  );
}
