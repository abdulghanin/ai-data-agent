"use client";

import { FC, useState } from "react";
import { useAskAI } from "@/lib/api";
import { Loader2 } from "lucide-react";

export const AskAI: FC = () => {
  const [question, setQuestion] = useState("");
  const { mutateAsync: ask, isPending, data: answer } = useAskAI();

  const handleAsk = async () => {
    if (!question.trim()) return;
    await ask(question);
    setQuestion("");
  };

  return (
    <div className="mt-10 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
        🤖 Ask the AI
      </h2>

      <textarea
        className="w-full border rounded p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
        rows={3}
        placeholder="e.g. How many customers spent more than $1000?"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        onClick={handleAsk}
        disabled={isPending}
        className={`
          w-full flex items-center justify-center px-4 py-2 rounded
          text-white bg-primary hover:bg-primary/80 disabled:opacity-50
        `}
      >
        {isPending ? (
          <>
            <Loader2 className="animate-spin mr-2" />
            Processing…
          </>
        ) : (
          "Ask"
        )}
      </button>

      {/* ------- Result ------- */}
      {answer && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded overflow-auto text-sm">
          <h3 className="font-semibold mt-4 mb-2">📄 Results</h3>
          <pre className="bg-white dark:bg-gray-900 p-2 border rounded whitespace-pre-wrap">
            {JSON.stringify(answer.rows, null, 2)}
          </pre>

          <p className="mt-2">
            Total rows returned: <b>{answer.count}</b>
          </p>
        </div>
      )}
    </div>
  );
};
