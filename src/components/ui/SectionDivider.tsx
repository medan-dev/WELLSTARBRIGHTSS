import { cn } from "@/lib/utils";

interface SectionDividerProps {
  position?: "top" | "bottom";
  fillColor?: string;
  strokeColor?: string;
  flipX?: boolean;
  flipY?: boolean;
  className?: string;
}

export function SectionDivider({
  position = "bottom",
  fillColor = "fill-background",
  strokeColor,
  flipX = false,
  flipY = false,
  className,
}: SectionDividerProps) {
  return (
    <div
      className={cn(
        "absolute left-0 w-full overflow-hidden pointer-events-none z-10",
        position === "bottom" ? "bottom-0" : "top-0",
        className
      )}
      style={{ height: "3rem" }}
    >
      <svg
        viewBox="0 0 1440 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "w-full h-full",
          flipX && "scale-x-[-1]",
          flipY && "scale-y-[-1]",
          flipX && flipY && "scale-[-1]"
        )}
        preserveAspectRatio="none"
      >
        <path
          d="M 0 50 L 380 50 C 430 50, 450 56, 480 56 C 510 56, 540 20, 600 20 C 650 20, 700 22, 750 22 L 900 22 C 950 22, 980 25, 1010 25 C 1040 25, 1070 20, 1100 20 L 1440 20 L 1440 80 L 0 80 Z"
          className={fillColor}
        />
        {strokeColor && (
          <path
            d="M 0 50 L 380 50 C 430 50, 450 56, 480 56 C 510 56, 540 20, 600 20 C 650 20, 700 22, 750 22 L 900 22 C 950 22, 980 25, 1010 25 C 1040 25, 1070 20, 1100 20 L 1440 20"
            className={cn("stroke-[2px] fill-none", strokeColor)}
          />
        )}
      </svg>
    </div>
  );
}
