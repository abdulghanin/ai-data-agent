"use client";

import { FC } from "react";
import { useDropzone } from "react-dropzone";
import { useUpload } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface UploadBoxProps {
  onUploadSuccess?: () => void;
}

export const UploadBox: FC<UploadBoxProps> = ({ onUploadSuccess }) => {
  const { mutateAsync: uploadFile, isPending } = useUpload();

  const onDrop = async (files: File[]) => {
    const file = files[0];
    const form = new FormData();
    form.append("file", file);
    await uploadFile(form);
    onUploadSuccess?.();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
        transition-colors
        ${isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:bg-gray-50"}
      `}
    >
      <input {...getInputProps()} />
      <p className="font-medium text-lg">
        📁 Drag & drop a CSV/Excel file, or click to select
      </p>

      {isPending && (
        <div className="mt-4 flex items-center justify-center text-primary">
          <Loader2 className="animate-spin mr-2" />
          <span>Uploading…</span>
        </div>
      )}
    </div>
  );
};
