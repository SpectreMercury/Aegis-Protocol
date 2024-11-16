import { cn } from "@/lib/utils";

interface HeatmapProps {
  data: number[];
  max: number;
  columns: number;
  className?: string;
  type: 'status' | 'progress';
  currentProgress?: number;
}

export function Heatmap({ data, columns, className, type = 'status', currentProgress = 0 }: HeatmapProps) {
  const getColor = (index: number) => {
    if (type === 'progress') {
      return index < currentProgress ? "bg-green-500" : "bg-neutral-200";
    } else {
      return "bg-green-500";
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div 
        className="grid w-full gap-1" 
        style={{ 
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >
        {data.map((_, index) => (
          <div
            key={index}
            className={cn(
              "aspect-square rounded-sm",
              getColor(index)
            )}
            style={{ minWidth: '12px', minHeight: '12px' }}
          />
        ))}
      </div>
    </div>
  );
}