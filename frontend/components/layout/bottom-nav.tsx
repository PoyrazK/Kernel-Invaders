"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Columns2, Home, Search, History, Info } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Liquid Glass Bottom Navigation
 * Floating bottom bar with glass morphism effect
 */

interface NavItem {
  href: string;
  icon: typeof Home;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/", icon: Home, label: "Ana Sayfa" },
  { href: "/analyze", icon: Search, label: "Analiz Et" },
  { href: "/compare", icon: Columns2, label: "Karşılaştır" },
  { href: "/history", icon: History, label: "Geçmiş" },
  { href: "/profile", icon: Info, label: "Hakkımızda" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4 px-4 pointer-events-none">
      <nav className="w-full max-w-lg pointer-events-auto">
        {/* Liquid Glass Container */}
        <div className="relative group">
          {/* Ambient Shadow */}
          <div className="absolute inset-0 bg-black/5 dark:bg-black/20 blur-2xl -translate-y-2 rounded-[2rem]" />
          
          {/* Glass Surface */}
          <div className="relative bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl backdrop-saturate-150 rounded-[2rem] border border-white/20 dark:border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_-8px_32px_rgba(0,0,0,0.3)]">
            {/* Inner Highlight (top edge reflection) */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 dark:via-white/20 to-transparent rounded-t-[2rem]" />
            
            {/* Specular Streak (light reflection) */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent dark:from-white/5 rounded-[2rem] opacity-60" />
            
            {/* Content */}
            <div className="relative px-2 py-2">
              <div className="flex items-center justify-around">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href !== "/" && pathname.startsWith(item.href));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/30 dark:hover:bg-white/10"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-6 h-6 transition-transform",
                          isActive && "scale-110"
                        )}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                      <span className="text-xs font-semibold">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
            
            {/* Bottom Depth Line */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-black/5 dark:via-white/5 to-transparent rounded-b-[2rem]" />
          </div>
        </div>
      </nav>
    </div>
  );
}

