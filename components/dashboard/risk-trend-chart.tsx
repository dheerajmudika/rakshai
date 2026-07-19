"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TrendPoint {
  date: string;
  scans: number;
  scams: number;
}

export function RiskTrendChart({ data }: { data: TrendPoint[] }) {
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    }),
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={formatted} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="scansGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B7BFF" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#3B7BFF" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="scamsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1B2438" vertical={false} />
        <XAxis
          dataKey="label"
          stroke="#ffffff40"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#ffffff40"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            background: "#0E1526",
            border: "1px solid #1B2438",
            borderRadius: 12,
            fontSize: 12,
            color: "#fff",
          }}
        />
        <Area
          type="monotone"
          dataKey="scans"
          stroke="#3B7BFF"
          strokeWidth={2}
          fill="url(#scansGradient)"
          name="Total Scans"
        />
        <Area
          type="monotone"
          dataKey="scams"
          stroke="#EF4444"
          strokeWidth={2}
          fill="url(#scamsGradient)"
          name="Scams Detected"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
