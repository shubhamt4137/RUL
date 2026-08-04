import React, { useCallback, useState } from 'react';
import { Upload, File, AlertCircle, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  error: string | null;
  isProcessing: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, error, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
    }
  }, []);

  const handleFileSelect = (file: File) => {
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!validTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.csv')) {
      alert('Please upload a CSV or Excel file');
      return;
    }
    
    setSelectedFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-300 ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-slate-300 bg-white hover:border-slate-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="sr-only"
          accept=".csv,.xls,.xlsx"
          onChange={handleInputChange}
          disabled={isProcessing}
        />
        
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            Upload Motor Data File
          </h3>
          
          <p className="text-slate-600 mb-6">
            Drag and drop your CSV or Excel file here, or click to browse
          </p>
          
          <label
            htmlFor="file-upload"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors duration-200 font-medium"
          >
            Choose File
          </label>
          
          <p className="text-sm text-slate-500 mt-4">
            Supported formats: CSV, XLS, XLSX (Max 10MB)
          </p>
        </div>
      </div>

      {selectedFile && (
        <div className="mt-6 bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <File className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-slate-800">{selectedFile.name}</p>
                <p className="text-sm text-slate-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <button
                onClick={handleUpload}
                disabled={isProcessing}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
              >
                {isProcessing ? 'Processing...' : 'Process File'}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="mt-8 bg-slate-50 rounded-lg p-6">
        <h4 className="font-semibold text-slate-800 mb-3">Required Data Format</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-slate-700 mb-1">Required Columns:</p>
            <ul className="text-slate-600 space-y-1">
              <li>• Motor ID</li>
              <li>• Temperature (°C)</li>
              <li>• Vibration (Hz)</li>
              <li>• Pressure (Bar)</li>
              <li>• RPM</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-slate-700 mb-1">Data Guidelines:</p>
            <ul className="text-slate-600 space-y-1">
              <li>• No missing values</li>
              <li>• Numeric sensor readings</li>
              <li>• One row per motor reading</li>
              <li>• Clear column headers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;