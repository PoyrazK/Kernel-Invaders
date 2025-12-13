"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface PriceComparisonChartProps {
  fairValue: number;
  listingPrice: number;
}

/**
 * Fiyat karşılaştırma grafiği
 * Fair Value vs İlan Fiyatı
 */
export function PriceComparisonChart({
  fairValue,
  listingPrice,
}: PriceComparisonChartProps) {
  const data = [
    {
      name: "Karşılaştırma",
      "Adil Değer": fairValue,
      "İlan Fiyatı": listingPrice,
    },
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl border shadow-lg">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium text-zinc-600">
                {entry.name}:
              </span>
              <span className="text-sm font-bold text-zinc-900">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-2 border-zinc-100">
      <CardHeader>
        <CardTitle className="text-lg">Fiyat Karşılaştırması</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis
                type="number"
                tickFormatter={(value) =>
                  new Intl.NumberFormat("tr-TR", {
                    notation: "compact",
                    compactDisplay: "short",
                  }).format(value)
                }
                stroke="#71717a"
                fontSize={12}
              />
              <YAxis type="category" dataKey="name" hide />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                formatter={(value) => (
                  <span className="text-sm font-medium text-zinc-700">
                    {value}
                  </span>
                )}
              />
              <Bar
                dataKey="Adil Değer"
                fill="#00D4FF"
                radius={[4, 4, 4, 4]}
                barSize={40}
              />
              <Bar
                dataKey="İlan Fiyatı"
                fill="#FFE135"
                radius={[4, 4, 4, 4]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

