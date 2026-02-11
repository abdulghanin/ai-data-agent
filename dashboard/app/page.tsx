"use client";

import { useStats } from "@/lib/api";
import { UploadBox } from "@/components/UploadBox";
import { StatsCards } from "@/components/StatsCards";
import { PreviewTable } from "@/components/PreviewTable";
import { AskAI } from "@/components/AskAI";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const { data: stats, isLoading } = useStats();

  // first numeric column for the chart (if any)
  const numericKey = stats?.preview?.[0]
    ? Object.entries(stats.preview[0]).find(([_, v]) => !isNaN(Number(v)))?.[0]
    : null;

  return (
    <main className="flex min-h-screen items-center justify-center p-4 sm:p-6 md:p-8">
      {/* The inner container is the *actual* dashboard – it stays centered */}
      <div className="w-full max-w-5xl space-y-8">
        <h1 className="text-3xl font-bold text-center">
          📊 AI Data Dashboard
        </h1>

        {/* 1️⃣  Upload */}
        <UploadBox onUploadSuccess={() => {}} />

        {/* 2️⃣  Stats cards */}
        <StatsCards stats={stats ?? null} loading={isLoading} />

        {/* 3️⃣  Data preview */}
        {stats?.preview?.length > 0 && (
          <section>
            <h2 className="font-semibold mb-4">👀 Preview (first {stats.preview.length} rows)</h2>
            <PreviewTable preview={stats.preview} />
          </section>
        )}

        {/* 4️⃣  Quick line chart */}
        {numericKey && stats?.preview?.length > 0 && (
          <section className="mt-8">
            <h2 className="font-semibold mb-4">📈 Quick Chart</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.preview}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="id" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey={numericKey}
                  stroke="#2563EB"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </section>
        )}

        {/* 5️⃣  Ask AI */}
        <AskAI />
      </div>
    </main>
  );
}
