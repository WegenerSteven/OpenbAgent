import React from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface DocumentUploaderProps {
  countyId: string | null;
}

export function DocumentUploader({ countyId }: DocumentUploaderProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [status, setStatus] = React.useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [docType, setDocType] = React.useState('Budget');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!file || !countyId) return;

    setStatus('uploading');
    const formData = new FormData();
    formData.append('budgetFile', file);
    formData.append('county', countyId);
    formData.append('docType', docType);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setStatus('success');
        setFile(null);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setStatus('error');
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
        <Upload size={12} /> Index New Document
      </h3>

      <div className="space-y-3">
        <select 
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          className="w-full text-xs font-semibold p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
        >
          <option value="Budget">County Budget</option>
          <option value="Audit">Auditor General Report</option>
          <option value="Hansard">Assembly Hansard</option>
        </select>

        <label className={cn(
          "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all",
          file ? "border-brand-emerald bg-emerald-50" : "border-slate-200 hover:border-brand-blue hover:bg-slate-50"
        )}>
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <FileText className={cn("mb-2", file ? "text-brand-emerald" : "text-slate-400")} size={24} />
            <p className="text-[10px] text-slate-500 font-bold uppercase">
              {file ? file.name : "Select PDF or Image"}
            </p>
          </div>
          <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx,.png,.jpg" />
        </label>
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || !countyId || status === 'uploading'}
        className="w-full bg-brand-blue text-white text-[10px] font-bold uppercase py-3 rounded-lg hover:bg-blue-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {status === 'uploading' ? (
          <><Loader2 size={12} className="animate-spin" /> Indexing...</>
        ) : status === 'success' ? (
          <><CheckCircle size={12} /> Document Indexed</>
        ) : (
          <>Process Document</>
        )}
      </button>

      {status === 'error' && (
        <p className="text-[9px] text-red-500 font-bold flex items-center gap-1 mt-2">
          <AlertCircle size={10} /> Upload failed. Ensure county is selected.
        </p>
      )}
    </div>
  );
}
