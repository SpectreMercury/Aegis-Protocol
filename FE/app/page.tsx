"use client";

import Link from "next/link";
import { Repeat, Activity, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-4">
      <div className="max-w-3xl text-center space-y-6">
        {/* Slogan */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
          Secure Your Assets with Aegis
        </h1>
        
        {/* 介绍文字 */}
        <p className="text-xl text-muted-foreground">
          A decentralized platform for secure asset management and trading
        </p>

        {/* 按钮组 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button asChild size="lg" className="gap-2">
            <Link href="/swap">
              <Repeat className="w-5 h-5" />
              <span>Start Swap</span>
            </Link>
          </Button>

          <Button asChild size="lg" className="gap-2">
            <Link href="/status">
              <Activity className="w-5 h-5" />
              <span>Check Status</span>
            </Link>
          </Button>

          <Button asChild size="lg" className="gap-2">
            <Link href="/balance">
              <Wallet className="w-5 h-5" />
              <span>View Balance</span>
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
