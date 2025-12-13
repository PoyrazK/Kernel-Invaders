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
        "min-h-screen pb-24 pt-28", // Header için üst padding + Alt navigasyon için alt padding
        !noPadding && "px-4 py-6",
        className
      )}
    >
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    </main>
  );
}

