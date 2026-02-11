// lib/api.ts
import axios from "axios";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";

/* ------------------- Backend URL ------------------- */
export const API_BASE = "http://127.0.0.1:8000"; // <-- change if needed
export const api = axios.create({ baseURL: API_BASE });

/* ------------------- Stats ------------------- */
export const useStats = () =>
  useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const { data } = await api.get("/stats");
      return data; // { total_rows, total_columns, preview }
    },
    staleTime: 5 * 60 * 1000, // 5 min cache
  });

/* ------------------- Upload ------------------- */
export const useUpload = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (form: FormData) => {
      await api.post("/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast.success("✅ File uploaded successfully");
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail ?? err.message;
      toast.error(`❌ Upload failed – ${msg}`);
    },
  });
};

/* ------------------- Ask AI ------------------- */
export const useAskAI = () =>
  useMutation({
    mutationFn: async (question: string) => {
      const { data } = await api.post("/ask", { question });
      return data; // { sql, rows, count }
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail ?? err.message;
      toast.error(`❌ Question failed – ${msg}`);
    },
  });
