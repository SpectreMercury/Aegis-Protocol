import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface HeatmapProps {
  data: number[];
  max: number;
  columns: number;
  className?: string;
  type?: 'progress' | 'status';
  currentProgress?: number;
  animate?: boolean;
}

export function Heatmap({ 
  data, 
  columns, 
  className, 
  type = 'status', 
  currentProgress = 0,
  animate = false 
}: HeatmapProps) {
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (animate && type === 'progress') {
      setActiveIndex(-1);
      
      let index = 0;
      const timer = setInterval(() => {
        if (index < currentProgress) {
          setActiveIndex(index);
          index++;
        } else {
          clearInterval(timer);
        }
      }, 50);

      return () => clearInterval(timer);
    }
  }, [animate, currentProgress, type]);

  return (
    <div className={cn("w-full", className)}>
      <div 
        className="grid w-full gap-1" 
        style={{ 
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >
        {data.map((value, index) => (
          <div
            key={index}
            className={cn(
              "aspect-square rounded-sm",
              {
                "bg-red-500": value < 0,
                "bg-green-500": (type === 'progress' && (index <= activeIndex || value > 0)) || 
                               (type === 'status' && value > 0),
                "bg-neutral-200": (type === 'progress' && index > activeIndex && value === 0) ||
                                 (type === 'status' && value === 0),
              }
            )}
            style={{ 
              minWidth: '12px', 
              minHeight: '12px',
              transition: 'background-color 0.2s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}