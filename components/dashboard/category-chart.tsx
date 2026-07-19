"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { categoryLabel } from "@/components/dashboard/badges";

const COLORS = ["#3B7BFF", "#7C5CFF", "#22D3EE", "#EAB308", "#F97316", "#EF4444", "#84CC16", "#22C55E"];

export function CategoryChart({ counts }: { counts: Record<string, number> }) {
  const data = Object.entries(counts)
    .filter(([category]) => category !== "none")
    .map(([category, count]) => ({ name: categoryLabel(category), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  if (data.length === 0) {
    return (
      <div className="flex h-52 items-center justify-center text-sm text-white/40">
        No scam categories detected yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <XAxis type="number" hide allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="name"
          width={140}
          stroke="#ffffff60"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,0.03)" }}
          contentStyle={{
            background: "#0E1526",
            border: "1px solid #1B2438",
            borderRadius: 12,
            fontSize: 12,
            color: "#fff",
          }}
        />
        <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={16}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
