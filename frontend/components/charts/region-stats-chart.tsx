"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { RegionStats } from "@/lib/types";

interface RegionStatsChartProps {
  stats: RegionStats;
  currentPrice: number;
  fairValue: number;
}

/**
 * Bölge fiyat dağılımı grafiği
 */
export function RegionStatsChart({
  stats,
  currentPrice,
  fairValue,
}: RegionStatsChartProps) {
  const data = [
    { name: "Minimum", value: stats.min, fill: "#e4e4e7" },
    { name: "Ortalama", value: stats.avg, fill: "#00D4FF" },
    { name: "Adil Değer", value: fairValue, fill: "#39FF14" },
    { name: "İlan Fiyatı", value: currentPrice, fill: "#FFE135" },
    { name: "Maksimum", value: stats.max, fill: "#e4e4e7" },
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="bg-white p-3 rounded-xl border shadow-lg">
          <p className="text-sm font-semibold text-zinc-900">{item.payload.name}</p>
          <p className="text-lg font-bold text-zinc-900">
            {formatCurrency(item.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-2 border-zinc-100">
      <CardHeader>
        <CardTitle className="text-lg">Bölge Fiyat Dağılımı</CardTitle>
        <CardDescription>
          Bu bölgedeki benzer konutların fiyat aralığı
          {stats.count && ` (${stats.count} ilan analiz edildi)`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis
                dataKey="name"
                stroke="#71717a"
                fontSize={11}
                angle={-20}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tickFormatter={(value) =>
                  new Intl.NumberFormat("tr-TR", {
                    notation: "compact",
                    compactDisplay: "short",
                  }).format(value)
                }
                stroke="#71717a"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={50}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

