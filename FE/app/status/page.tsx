"use client";

import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Heatmap } from "@/components/ui/heatmap";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function StatusPage() {
  const [nextSync] = useState<number>(47);
  const [blockProgress, setBlockProgress] = useState<number[]>([]);
  const [systemUptime, setSystemUptime] = useState<number[]>([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      // 模拟数据加载
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBlockProgress(Array(100).fill(0));
      setSystemUptime(Array(90).fill(100));
      setLoading(false);
      
      // 触发动画
      setTimeout(() => {
        setShowAnimation(true);
      }, 100);
    };

    initData();
  }, []);

  // 骨架屏组件
  const StatusSkeleton = () => (
    <Card className="p-6 mb-8 bg-gradient-to-r from-green-50 to-blue-50">
      <div className="space-y-8">
        {/* 同步倒计时骨架屏 */}
        <div>
          <Skeleton className="h-5 w-32 mb-2 bg-neutral-200/70" />
          <Skeleton className="h-8 w-48 bg-neutral-200/70" />
        </div>

        {/* 同步进度骨架屏 */}
        <div>
          <div className="flex justify-between mb-3">
            <Skeleton className="h-4 w-24 bg-neutral-200/70" />
            <Skeleton className="h-4 w-20 bg-neutral-200/70" />
          </div>
          <div className="grid grid-cols-20 gap-1">
            {Array(100).fill(0).map((_, i) => (
              <Skeleton 
                key={i} 
                className="aspect-square w-full bg-neutral-200/70"
              />
            ))}
          </div>
        </div>

        {/* 系统稳定性骨架屏 */}
        <div>
          <div className="flex justify-between mb-3">
            <Skeleton className="h-4 w-32 bg-neutral-200/70" />
            <Skeleton className="h-4 w-20 bg-neutral-200/70" />
          </div>
          <div className="grid grid-cols-15 gap-1">
            {Array(90).fill(0).map((_, i) => (
              <Skeleton 
                key={i} 
                className="aspect-square w-full bg-neutral-200/70"
              />
            ))}
          </div>
          <div className="flex justify-end items-center gap-2 mt-2">
            <Skeleton className="h-3 w-8 bg-neutral-200/70" />
            <div className="flex gap-1">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton 
                  key={i} 
                  className="w-3 h-3 bg-neutral-200/70" 
                />
              ))}
            </div>
            <Skeleton className="h-3 w-8 bg-neutral-200/70" />
          </div>
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto max-w-3xl py-8">
        <StatusSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <Card className="p-6 mb-8 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="space-y-8">
          {/* 下一次同步倒计时 */}
          <div>
            <h3 className="text-base font-medium mb-1">距离下一次同步</h3>
            <div className="text-2xl text-green-600 font-medium">
              还需 {nextSync} 个区块
            </div>
          </div>

          {/* 区块同步进度 */}
          <div>
            <div className="flex justify-between mb-3">
              <span className="text-sm">当前同步进度</span>
              <span className="text-sm text-muted-foreground">100个区块</span>
            </div>
            <Heatmap 
              data={blockProgress}
              max={100}
              columns={20}
              type="progress"
              currentProgress={53}
              className="w-full"
              animate={showAnimation}
            />
          </div>

          {/* 系统稳定性 */}
          <div>
            <div className="flex justify-between mb-3">
              <span className="text-sm">系统稳定运行状态</span>
              <span className="text-sm text-muted-foreground">最近90天</span>
            </div>
            <Heatmap 
              data={systemUptime}
              max={100}
              columns={15}
              className="w-full"
              type="status"
            />
            <div className="flex justify-end items-center gap-2 mt-2">
              <span className="text-xs text-muted-foreground">Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={cn(
                      "w-3 h-3 rounded-sm",
                      level === 0 ? "bg-neutral-200" : "bg-green-500",
                      level === 1 && "opacity-25",
                      level === 2 && "opacity-50",
                      level === 3 && "opacity-75",
                      level === 4 && "opacity-100"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">More</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 