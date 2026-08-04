import React from 'react';
import { Download } from 'lucide-react';
import { PredictionData } from '../types';

interface ExportButtonProps {
  predictions: PredictionData;
}

const ExportButton: React.FC<ExportButtonProps> = ({ predictions }) => {
  const handleExport = () => {
    // Create CSV content
    const headers = [
      'Motor ID',
      'Temperature (°C)',
      'Vibration (Hz)',
      'Pressure (Bar)',
      'RPM',
      'Predicted RUL (hours)',
      'Confidence Score (%)',
      'Status'
    ];

    const getRULStatus = (rul: number) => {
      if (rul < 150) return 'Urgent';
      if (rul < 300) return 'Caution';
      return 'Good';
    };

    const csvContent = [
      headers.join(','),
      ...predictions.results.map(prediction => [
        prediction.motorId,
        prediction.inputParameters.temperature,
        prediction.inputParameters.vibration,
        prediction.inputParameters.pressure,
        prediction.inputParameters.rpm,
        prediction.predictedRUL,
        prediction.confidenceScore,
        getRULStatus(prediction.predictedRUL)
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `motor_rul_predictions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
    >
      <Download className="w-4 h-4" />
      <span>Export CSV</span>
    </button>
  );
};

export default ExportButton;