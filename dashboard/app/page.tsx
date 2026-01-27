"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API = "http://127.0.0.1:8000";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [preview, setPreview] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);

  // ============================
  // Upload
  // ============================

  const onDrop = async (files) => {
    const file = files[0];

    const form = new FormData();
    form.append("file", file);

    try {
      setLoading(true);

      await axios.post(`${API}/upload`, form);

      alert("File uploaded successfully ✅");

      loadStats();
    } catch (err) {
      alert("Upload failed ❌");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
  });

  // ============================
  // Load Stats
  // ============================

  const loadStats = async () => {
    try {
      const res = await axios.get(`${API}/stats`);

      setStats(res.data);
      setPreview(res.data.preview || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  // ============================
  // Ask AI
  // ============================

  const askAI = async () => {
    if (!question) return;

    try {
      setLoading(true);

      const res = await axios.post(`${API}/ask`, {
        question,
      });

      setAnswer(res.data);
    } catch (err) {
      alert("Question failed ❌");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // Render
  // ============================

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <h1 className="text-3xl font-bold text-center">
        📊 AI Data Dashboard
      </h1>

      {/* Upload */}
      <div
        {...getRootProps()}
        className="border-2 border-dashed p-6 text-center rounded cursor-pointer hover:bg-gray-50"
      >
        <input {...getInputProps()} />

        <p className="font-medium">
          📁 Drag & drop CSV / Excel file or click to select
        </p>

        {loading && (
          <p className="text-blue-500">
            Processing...
          </p>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 text-center">

          <div className="p-4 bg-gray-100 rounded">
            <h3>Total Rows</h3>
            <p className="text-xl font-bold">
              {stats.total_rows}
            </p>
          </div>

          <div className="p-4 bg-gray-100 rounded">
            <h3>Total Columns</h3>
            <p className="text-xl font-bold">
              {stats.total_columns}
            </p>
          </div>

        </div>
      )}

      {/* Preview */}
      {preview.length > 0 && (
        <div className="overflow-auto">

          <h2 className="font-bold mb-2">👀 Preview</h2>

          <table className="border w-full text-sm">

            <thead>
              <tr className="bg-gray-200">

                {Object.keys(preview[0]).map((col) => (
                  <th key={col} className="border p-2">
                    {col}
                  </th>
                ))}

              </tr>
            </thead>

            <tbody>

              {preview.map((row, i) => (
                <tr key={i}>

                  {Object.values(row).map((v, j) => (
                    <td key={j} className="border p-1">
                      {v}
                    </td>
                  ))}

                </tr>
              ))}

            </tbody>
          </table>
        </div>
      )}

      {/* Chart */}
      {preview.length > 0 && (
        <div className="h-80">

          <h2 className="font-bold mb-2">📈 Sample Chart</h2>

          <ResponsiveContainer width="100%" height="100%">

            <LineChart data={preview}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="id" />

              <YAxis />

              <Tooltip />

              {/* First numeric column */}
              {Object.keys(preview[0])
                .filter((k) => k !== "id")[0] && (
                <Line
                  type="monotone"
                  dataKey={
                    Object.keys(preview[0]).filter(
                      (k) => k !== "id"
                    )[0]
                  }
                  stroke="#8884d8"
                />
              )}

            </LineChart>

          </ResponsiveContainer>

        </div>
      )}

      {/* Ask AI */}
      <div className="space-y-2">

        <h2 className="font-bold">
          🤖 Ask AI
        </h2>

        <textarea
          className="w-full border p-2 rounded"
          rows={3}
          placeholder="Example: How many customers are there?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <button
          onClick={askAI}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ask
        </button>

      </div>

      {/* Answer */}
      {answer && (
        <div className="bg-gray-100 p-4 rounded space-y-2">

          <h3 className="font-bold">🧠 SQL</h3>

          <pre className="bg-black text-green-400 p-2 rounded text-sm">
            {answer.sql}
          </pre>

          <h3 className="font-bold">📄 Results</h3>

          <pre className="bg-white p-2 border rounded text-sm overflow-auto">
            {JSON.stringify(answer.rows, null, 2)}
          </pre>

          <p>
            Total results: <b>{answer.count}</b>
          </p>

        </div>
      )}

    </div>
  );
}
