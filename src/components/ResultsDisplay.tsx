import React from 'react';
import { PredictionData, UploadedFile } from '../types';
import SummaryStats from './SummaryStats';
import PredictionTable from './PredictionTable';
import RULVisualization from './RULVisualization';
import ExportButton from './ExportButton';
import { ArrowLeft, FileText, Calendar, Database } from 'lucide-react';

interface ResultsDisplayProps {
  predictions: PredictionData;
  uploadedFile: UploadedFile;
  onReset: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ predictions, uploadedFile, onReset }) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              RUL Prediction Results
            </h2>
            <p className="text-slate-600">
              Analysis complete for {predictions.summary.totalMotors} motors
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <ExportButton predictions={predictions} />
            <button
              onClick={onReset}
              className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>New Analysis</span>
            </button>
          </div>
        </div>

        {/* File Info */}
        <div className="grid md:grid-cols-3 gap-4 bg-slate-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-slate-500" />
            <div>
              <p className="text-sm text-slate-500">File Name</p>
              <p className="font-medium text-slate-800">{uploadedFile.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Database className="w-5 h-5 text-slate-500" />
            <div>
              <p className="text-sm text-slate-500">File Size</p>
              <p className="font-medium text-slate-800">{formatFileSize(uploadedFile.size)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-slate-500" />
            <div>
              <p className="text-sm text-slate-500">Processed At</p>
              <p className="font-medium text-slate-800">
                {uploadedFile.uploadTime.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <SummaryStats summary={predictions.summary} />

      {/* Visualizations */}
      <RULVisualization predictions={predictions.results} />

      {/* Detailed Results Table */}
      <PredictionTable predictions={predictions.results} />
    </div>
  );
};

export default ResultsDisplay;