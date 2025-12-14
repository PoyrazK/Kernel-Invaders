import { cn } from "@/lib/utils";

/**
 * Sayfa konteyner bileşeni
 * Alt navigasyon için padding ekler
 */

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function PageContainer({ 
  children, 
  className,
  noPadding = false 
}: PageContainerProps) {
  return (
    <main
      className={cn(
        "min-h-screen pb-36 pt-32", // Floating header için üst padding + Floating bottom nav için alt padding
        !noPadding && "px-4",
        className
      )}
    >
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    </main>
  );
}

