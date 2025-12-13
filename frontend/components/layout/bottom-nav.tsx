"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Columns2, Home, Search, History, User } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Alt navigasyon bileşeni
 * Mobil uyumlu, cesur ve eğlenceli ikonlarla
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
  { href: "/profile", icon: User, label: "Profil" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border px-2 pb-safe transition-colors">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-around py-2">
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
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
    </nav>
  );
}

