"use client";

import SignaturePad from "signature_pad";
import { RefreshCcw, Save } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";

export function ImzaCanvas({
  onChange,
}: {
  onChange?: (value: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const signatureRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    const context = canvas.getContext("2d");
    context?.scale(ratio, ratio);

    signatureRef.current = new SignaturePad(canvas, {
      backgroundColor: "#141416",
      penColor: "#fafafa",
    });
  }, []);

  function handleClear() {
    signatureRef.current?.clear();
    onChange?.("");
  }

  function handleSave() {
    const value = signatureRef.current?.toDataURL("image/png") ?? "";
    onChange?.(value);
  }

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-elevated)] p-2">
        <canvas ref={canvasRef} className="h-44 w-full rounded-xl" />
      </div>
      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="secondary" onClick={handleClear}>
          <RefreshCcw className="size-4" />
          Temizle
        </Button>
        <Button type="button" onClick={handleSave}>
          <Save className="size-4" />
          Imzayi Kaydet
        </Button>
      </div>
    </div>
  );
}
