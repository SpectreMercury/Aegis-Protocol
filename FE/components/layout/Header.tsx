"use client";

import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import { Repeat, Activity, Wallet } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b flex justify-center border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* 左侧 Logo 和菜单 */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Aegis</span>
          </Link>

          {/* 平铺菜单 */}
          <nav className="flex items-center gap-6">
            <Link 
              href="/swap" 
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
            >
              <Repeat size={20} />
              <span>Swap</span>
            </Link>
            
            <Link 
              href="/status" 
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
            >
              <Activity size={20} />
              <span>Status</span>
            </Link>
            
            <Link 
              href="/balance" 
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
            >
              <Wallet size={20} />
              <span>Balance</span>
            </Link>
          </nav>
        </div>

        {/* 右侧钱包连接按钮 */}
        <div>
          <ConnectKitButton />
        </div>
      </div>
    </header>
  );
};

export default Header; 