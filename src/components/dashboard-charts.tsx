"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const COLORS = ["#E11D2E", "#F59E0B", "#16A34A", "#3B82F6", "#71717A"];

export function DashboardCharts({
  charts,
}: {
  charts: {
    title: string;
    description: string;
    data: Array<{ name: string; value: number }>;
  }[];
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {charts.map((chart) => (
        <Card key={chart.title}>
          <CardHeader>
            <div>
              <CardTitle>{chart.title}</CardTitle>
              <CardDescription>{chart.description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chart.data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={72}
                  outerRadius={108}
                  paddingAngle={4}
                >
                  {chart.data.map((entry, index) => (
                    <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    background: "#141416",
                    border: "1px solid #2A2A2E",
                    color: "#FAFAFA",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
