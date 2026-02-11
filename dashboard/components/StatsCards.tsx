"use client";

import { FC } from "react";

interface Stats {
  total_rows: number;
  total_columns: number;
}

interface Props {
  stats: Stats | null;
  loading: boolean;
}

export const StatsCards: FC<Props> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="h-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-24 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Total rows
        </h3>
        <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-gray-200">
          {stats.total_rows}
        </p>
      </div>

      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Total columns
        </h3>
        <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-gray-200">
          {stats.total_columns}
        </p>
      </div>
    </div>
  );
};
