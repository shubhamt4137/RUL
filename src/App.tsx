import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import FileUpload from './components/FileUpload';
import ResultsDisplay from './components/ResultsDisplay';
import { PredictionData, UploadedFile } from './types';

function App() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [predictions, setPredictions] = useState<PredictionData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Simulate file processing - in production, this would call your backend API
      const formData = new FormData();
      formData.append('file', file);
      
      // Mock API call - replace with actual backend endpoint
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time
      
      // Mock prediction results
      const mockPredictions: PredictionData = {
        results: Array.from({ length: 20 }, (_, i) => ({
          motorId: `MOTOR-${String(i + 1).padStart(3, '0')}`,
          inputParameters: {
            temperature: Math.round(60 + Math.random() * 40),
            vibration: Math.round(100 + Math.random() * 50),
            pressure: Math.round(50 + Math.random() * 30),
            rpm: Math.round(1800 + Math.random() * 400)
          },
          predictedRUL: Math.round(100 + Math.random() * 400),
          confidenceScore: Math.round(75 + Math.random() * 20)
        })),
        summary: {
          totalMotors: 20,
          averageRUL: 250,
          minRUL: 120,
          maxRUL: 480,
          urgentMaintenanceCount: 3
        }
      };
      
      setUploadedFile({
        name: file.name,
        size: file.size,
        uploadTime: new Date()
      });
      
      setPredictions(mockPredictions);
    } catch (err) {
      setError('Failed to process file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setUploadedFile(null);
    setPredictions(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Industrial Motor RUL Prediction
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Upload your motor sensor data and get AI-powered predictions for Remaining Useful Life (RUL) 
            to optimize maintenance schedules and prevent unexpected failures.
          </p>
        </header>

        {!predictions && !isProcessing && (
          <>
            <Dashboard />
            <FileUpload 
              onFileUpload={handleFileUpload}
              error={error}
              isProcessing={isProcessing}
            />
          </>
        )}

        {isProcessing && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Processing Your Data</h3>
            <p className="text-slate-500">Running Random Forest model predictions...</p>
          </div>
        )}

        {predictions && uploadedFile && (
          <ResultsDisplay 
            predictions={predictions}
            uploadedFile={uploadedFile}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}

export default App;