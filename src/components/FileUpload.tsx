"use client";

import { useRef, useState, useEffect } from "react";
import { uploadFileAction } from "@/actions/file.actions";
import { Button } from "@/components/ui/button";
import { UploadCloud, Loader2, FileText, X } from "lucide-react";
import Image from "next/image";

export function FileUpload({ taskId, projectId }: { taskId?: string, projectId?: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function handleUpload(formData: FormData) {
    setIsUploading(true);
    setError(null);
    
    if (taskId) formData.append("taskId", taskId);
    if (projectId) formData.append("projectId", projectId);

    try {
      const result = await uploadFileAction(formData);
      
      setIsUploading(false);
      if (result?.error) {
        setError(result.error);
      } else {
        formRef.current?.reset();
        setSelectedFile(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } catch (_err) {
      setIsUploading(false);
      setError("File is too large or upload failed.");
    }
  }

  return (
    <form ref={formRef} action={handleUpload} className="flex flex-col space-y-3 p-4 border border-slate-200 rounded-lg bg-slate-50/50">
      <div className="flex items-center space-x-4">
        <label className="flex-1 flex items-center justify-center px-4 py-6 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors bg-white relative">
          <div className="flex flex-col items-center space-y-2 text-center">
            {previewUrl ? (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden shadow-sm ring-1 ring-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ) : selectedFile ? (
              <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 ring-1 ring-indigo-200 shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
            ) : (
              <UploadCloud className="w-8 h-8 text-slate-400" />
            )}

            <span className="text-sm text-slate-700 font-semibold max-w-[200px] truncate px-2">
              {selectedFile ? selectedFile.name : "Click to select a file"}
            </span>
            
            {!selectedFile && (
              <span className="text-xs text-slate-500 font-medium">PDF, DWG, DXF, PNG, JPG</span>
            )}
          </div>
          
          {selectedFile && (
            <div 
              className="absolute top-2 right-2 p-1 bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 rounded-full transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setSelectedFile(null);
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
                if (formRef.current) formRef.current.reset();
              }}
            >
              <X className="w-4 h-4" />
            </div>
          )}

          <input 
            type="file" 
            name="file" 
            className="hidden" 
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setSelectedFile(file);
              
              if (previewUrl) URL.revokeObjectURL(previewUrl);
              
              if (file && file.type.startsWith("image/")) {
                setPreviewUrl(URL.createObjectURL(file));
              } else {
                setPreviewUrl(null);
              }
            }}
          />
        </label>
      </div>
      
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
      
      <Button type="submit" disabled={isUploading || !selectedFile} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm rounded-xl">
        {isUploading ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
        ) : (
          "Upload File"
        )}
      </Button>
    </form>
  );
}
