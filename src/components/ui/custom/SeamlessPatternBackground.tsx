import React, { memo, useId } from "react";

interface SvgItem {
  href: string;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity?: number;
  rotate?: number;
}

interface SeamlessPatternProps {
  svgs: SvgItem[];
  gradient: {
    from: string;
    to: string;
    angle?: number;
  };
  tileSize?: number;
  className?: string;
}

export const CHAT_PATTERN_CONFIG = {
  gradient: { from: "#30ff79", to: "#bdfcd4", angle: 15 },
  tileSize: 200,
  svgs: [
    {
      href: "/logo-1.svg",
      x: 30,
      y: 30,
      width: 100,
      height: 30,
      opacity: 0.2,
      rotate: 12,
    },
    {
      href: "/logo-2.svg",
      x: 15,
      y: 50,
      width: 200,
      height: 30,
      opacity: 0.12,
      rotate: -15,
    },
    {
      href: "/logo-3.svg",
      x: 120,
      y: 100,
      width: 30,
      height: 30,
      opacity: 0.1,
      rotate: 25,
    },
    {
      href: "/logo-1.svg",
      x: 30,
      y: 30,
      width: 100,
      height: 30,
      opacity: 0.2,
      rotate: 12,
    },
  ],
};

export const SeamlessPatternBackground: React.FC<SeamlessPatternProps> = memo(
  ({ svgs, gradient, tileSize = 200, className = "" }) => {
    const uniqueId = useId();
    const gradientId = `grad-${uniqueId}`;
    const patternId = `pat-${uniqueId}`;
    const angle = gradient.angle || 135;

    return (
      <svg
        className={`absolute inset-0 w-full h-full ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            gradientTransform={`rotate(${angle})`}
          >
            <stop offset="0%" stopColor={gradient.from} />
            <stop offset="100%" stopColor={gradient.to} />
          </linearGradient>

          <pattern
            id={patternId}
            x="0"
            y="0"
            width={tileSize}
            height={tileSize}
            patternUnits="userSpaceOnUse"
          >
            {svgs.map((svg, index) => (
              <image
                key={index}
                href={svg.href}
                x={svg.x}
                y={svg.y}
                width={svg.width}
                height={svg.height}
                opacity={svg.opacity ?? 0.15}
                transform={
                  svg.rotate
                    ? `rotate(${svg.rotate} ${svg.x + svg.width / 2} ${svg.y + svg.height / 2})`
                    : undefined
                }
              />
            ))}
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill={`url(#${gradientId})`} />
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    );
  },
);
