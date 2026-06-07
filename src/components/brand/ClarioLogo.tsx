import { cn } from "../../lib/utils";

interface ClarioLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function ClarioLogo({ size = "md", showText = true, className }: ClarioLogoProps) {
  const sizes = {
    sm: { mark: "h-9 w-9", text: "text-sm", sub: "text-xs", spark: "h-3 w-3" },
    md: { mark: "h-12 w-12", text: "text-xl", sub: "text-sm", spark: "h-4 w-4" },
    lg: { mark: "h-14 w-14", text: "text-2xl", sub: "text-sm", spark: "h-4 w-4" },
  }[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className={cn("relative flex shrink-0 items-center justify-center rounded-2xl bg-[#ff6b4a] text-white shadow-soft", sizes.mark)}>
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[#ffd166]" />
        <span className={cn("absolute bottom-2 left-2 rounded-full bg-white/90", sizes.spark)} />
        <span className="relative text-sm font-black tracking-tight">CL</span>
      </span>
      {showText && (
        <span>
          <span className={cn("block font-semibold leading-none text-slate-950", sizes.text)}>Clario</span>
          <span className={cn("mt-1 block text-slate-500", sizes.sub)}>Contract jobs, matched fast</span>
        </span>
      )}
    </div>
  );
}
