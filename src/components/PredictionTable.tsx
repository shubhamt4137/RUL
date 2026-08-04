import React, { useState } from 'react';
import { MotorPrediction } from '../types';
import { ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface PredictionTableProps {
  predictions: MotorPrediction[];
}

const PredictionTable: React.FC<PredictionTableProps> = ({ predictions }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<keyof MotorPrediction | 'none'>('none');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 10;

  const sortedPredictions = React.useMemo(() => {
    if (sortBy === 'none') return predictions;
    
    return [...predictions].sort((a, b) => {
      let aValue, bValue;
      
      if (sortBy === 'predictedRUL' || sortBy === 'confidenceScore') {
        aValue = a[sortBy];
        bValue = b[sortBy];
      } else if (sortBy === 'motorId') {
        aValue = a.motorId;
        bValue = b.motorId;
      } else {
        return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [predictions, sortBy, sortOrder]);

  const paginatedPredictions = sortedPredictions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(predictions.length / itemsPerPage);

  const handleSort = (column: keyof MotorPrediction) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getRULStatus = (rul: number) => {
    if (rul < 150) return { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50', label: 'Urgent' };
    if (rul < 300) return { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Caution' };
    return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', label: 'Good' };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800">Detailed Predictions</h3>
        <p className="text-slate-600 text-sm mt-1">
          Individual motor analysis with sensor parameters and RUL predictions
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th 
                className="text-left p-4 font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('motorId')}
              >
                Motor ID
                {sortBy === 'motorId' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="text-left p-4 font-semibold text-slate-700">Temperature (°C)</th>
              <th className="text-left p-4 font-semibold text-slate-700">Vibration (Hz)</th>
              <th className="text-left p-4 font-semibold text-slate-700">Pressure (Bar)</th>
              <th className="text-left p-4 font-semibold text-slate-700">RPM</th>
              <th 
                className="text-left p-4 font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('predictedRUL')}
              >
                Predicted RUL (hrs)
                {sortBy === 'predictedRUL' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="text-left p-4 font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleSort('confidenceScore')}
              >
                Confidence
                {sortBy === 'confidenceScore' && (
                  <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th className="text-left p-4 font-semibold text-slate-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPredictions.map((prediction, index) => {
              const status = getRULStatus(prediction.predictedRUL);
              return (
                <tr key={prediction.motorId} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <span className="font-mono text-sm font-medium text-slate-800">
                      {prediction.motorId}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">{prediction.inputParameters.temperature}</td>
                  <td className="p-4 text-slate-600">{prediction.inputParameters.vibration}</td>
                  <td className="p-4 text-slate-600">{prediction.inputParameters.pressure}</td>
                  <td className="p-4 text-slate-600">{prediction.inputParameters.rpm}</td>
                  <td className="p-4">
                    <span className="font-semibold text-slate-800">
                      {prediction.predictedRUL}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-slate-600">{prediction.confidenceScore}%</span>
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${status.bg}`}>
                      <status.icon className={`w-4 h-4 ${status.color}`} />
                      <span className={`text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, predictions.length)} of {predictions.length} results
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionTable;