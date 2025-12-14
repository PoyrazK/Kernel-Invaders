"use client";

import { ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { SortOption } from "@/lib/types";
import { SORT_OPTIONS } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface SortDropdownProps {
  value: string; // SortOption id
  onChange: (option: SortOption) => void;
  className?: string;
}

/**
 * Sıralama dropdown bileşeni
 */
export function SortDropdown({ value, onChange, className }: SortDropdownProps) {
  // Grup ayırıcıları için index'ler (her 2 seçenekten sonra)
  const separatorIndices = [1, 3, 5, 7, 9];

  const handleChange = (optionId: string) => {
    const option = SORT_OPTIONS.find((opt) => opt.id === optionId);
    if (option) {
      onChange(option);
    }
  };

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className={cn("w-[220px] gap-2", className)}>
        <ArrowUpDown className="w-4 h-4 shrink-0" />
        <SelectValue placeholder="Sırala..." />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((option, index) => (
          <div key={option.id}>
            <SelectItem value={option.id}>
              {option.label}
            </SelectItem>
            {separatorIndices.includes(index) && <SelectSeparator />}
          </div>
        ))}
      </SelectContent>
    </Select>
  );
}
