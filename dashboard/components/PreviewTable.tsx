"use client";

import { FC } from "react";

interface PreviewTableProps {
  preview: Record<string, any>[];
}

/* Simple responsive table */
export const PreviewTable: FC<PreviewTableProps> = ({ preview }) => {
  if (!preview?.length) return null;

  const columns = Object.keys(preview[0]);

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-2 text-left text-sm font-medium text-gray-600 dark:text-gray-300"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {preview.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "" : "bg-gray-50 dark:bg-gray-800"}>
              {columns.map((c) => (
                <td key={c} className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                  {row[c]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
