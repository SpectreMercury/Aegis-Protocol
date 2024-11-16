"use client";

import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Heatmap } from "@/components/ui/heatmap";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useSystemStore } from '@/lib/store';

export default function StatusPage() {
  const [nextSync] = useState<number>(47);
  const [blockProgress, setBlockProgress] = useState<number[]>([]);
  const [systemUptime, setSystemUptime] = useState<number[]>([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showStopDialog, setShowStopDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentBlock, setCurrentBlock] = useState(47);
  const setEmergencyMode = useSystemStore((state) => state.setEmergencyMode);

  useEffect(() => {
    const initData = async () => {
      // Simulate data loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBlockProgress(Array(100).fill(0));
      setSystemUptime(Array(90).fill(100));
      setLoading(false);
      
      // Trigger animation
      setTimeout(() => {
        setShowAnimation(true);
      }, 100);
    };

    initData();
  }, []);

  // Skeleton component
  const StatusSkeleton = () => (
    <Card className="p-6 mb-8 bg-gradient-to-r from-green-50 to-blue-50">
      <div className="space-y-8">
        {/* Sync countdown skeleton */}
        <div>
          <Skeleton className="h-5 w-32 mb-2 bg-neutral-200/70" />
          <Skeleton className="h-8 w-48 bg-neutral-200/70" />
        </div>

        {/* Sync progress skeleton */}
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

        {/* System stability skeleton */}
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

  const handleStop = () => {
    setShowStopDialog(true);
  };

  const handleStopConfirm = () => {
    setShowStopDialog(false);
    setShowConfirmDialog(true);
  };

  const handleFinalConfirm = () => {
    setShowConfirmDialog(false);
    setIsStopped(true);
    setEmergencyMode(true);
    
    // Update block progress heatmap
    const newBlockProgress = Array(100).fill(0);
    for (let i = 0; i < currentBlock - 1; i++) {
      newBlockProgress[i] = 100; // Green for completed blocks
    }
    newBlockProgress[currentBlock - 1] = -100; // Red for error state
    setBlockProgress(newBlockProgress);
    
    // Update system uptime heatmap
    const newSystemUptime = [...systemUptime];
    newSystemUptime[newSystemUptime.length - 1] = -100; // Red for latest status
    setSystemUptime(newSystemUptime);
  };

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
          {/* Next sync countdown */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-medium mb-1">
                {isStopped ? "Roll Up Status" : "Next Sync In"}
              </h3>
              <div className={cn(
                "text-2xl font-medium",
                isStopped ? "text-red-600" : "text-green-600"
              )}>
                {isStopped ? "System Forcibly Stopped" : `${nextSync} blocks remaining`}
              </div>
            </div>
            {!isStopped && (
              <Button 
                variant="destructive" 
                onClick={handleStop}
              >
                Force Stop
              </Button>
            )}
          </div>

          {/* Block sync progress */}
          <div>
            <div className="flex justify-between mb-3">
              <span className="text-sm">Current sync progress</span>
              <span className="text-sm text-muted-foreground">100 blocks</span>
            </div>
            <Heatmap 
              data={blockProgress}
              max={100}
              columns={20}
              type="progress"
              currentProgress={isStopped ? currentBlock - 1 : currentBlock}
              className="w-full"
              animate={showAnimation}
            />
          </div>

          {/* System stability */}
          <div>
            <div className="flex justify-between mb-3">
              <span className="text-sm">System stability status</span>
              <span className="text-sm text-muted-foreground">Last 90 days</span>
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

          {/* Add confirmation dialogs */}
          <Dialog open={showStopDialog} onOpenChange={setShowStopDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Stop</DialogTitle>
                <DialogDescription>
                  Are you sure you want to force stop the Roll Up? This may result in data inconsistency.
                </DialogDescription>
              </DialogHeader>
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This action requires Governor approval and cannot be undone.
                </AlertDescription>
              </Alert>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowStopDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleStopConfirm}>
                  Confirm Stop
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Governor Confirmation</DialogTitle>
                <DialogDescription>
                  Please enter Governor key for secondary confirmation
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleFinalConfirm}>
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </div>
  );
} 