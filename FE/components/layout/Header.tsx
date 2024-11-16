"use client";

import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import { Repeat, Activity, Wallet, ChevronDown, Shield } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  const isTradeActive = pathname.startsWith('/swap') || pathname.startsWith('/pools');

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
            {/* Trade 下拉菜单 */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary outline-none">
                <span className={cn(
                  "flex items-center gap-2",
                  isTradeActive && "text-primary"
                )}>
                  <Repeat size={20} />
                  <span>Trade</span>
                  <ChevronDown size={16} />
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[160px]">
                <Link href="/swap">
                  <DropdownMenuItem className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Repeat size={16} />
                      <span>Swap</span>
                    </div>
                  </DropdownMenuItem>
                </Link>
                <Link href="/pools">
                  <DropdownMenuItem className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Activity size={16} />
                      <span>Pools</span>
                    </div>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link 
              href="/status" 
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                pathname === "/status" && "text-primary"
              )}
            >
              <Activity size={20} />
              <span>Status</span>
            </Link>
            
            <Link 
              href="/balance" 
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                pathname === "/balance" && "text-primary"
              )}
            >
              <Wallet size={20} />
              <span>Balance</span>
            </Link>
            <Link 
              href="/layer2" 
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                pathname === "/layer2" && "text-primary"
              )}
            >
              <Shield size={20} />
              <span>AVS</span>
            </Link>
          </nav>
        </div>

        {/* 右侧部分添加网络选择器 */}
        <div className="flex items-center gap-4">
          {/* 网络切换下拉菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary outline-none">
              <span className="flex items-center gap-2">
                <Activity size={20} />
                <span>选择网络</span>
                <ChevronDown size={16} />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Activity size={16} />
                  <span>Aegis power by scroll</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Activity size={16} />
                  <span>Aegis power by arbitrum</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Activity size={16} />
                  <span>Aegis power by op</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 原有的钱包连接按钮 */}
          <ConnectKitButton />
        </div>
      </div>
    </header>
  );
};

export default Header; 