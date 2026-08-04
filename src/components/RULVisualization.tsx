import React, { useState } from 'react';
import { MotorPrediction } from '../types';
import { BarChart3, TrendingUp } from 'lucide-react';

interface RULVisualizationProps {
  predictions: MotorPrediction[];
}

const RULVisualization: React.FC<RULVisualizationProps> = ({ predictions }) => {
  const [viewType, setViewType] = useState<'distribution' | 'trend'>('distribution');

  // Calculate RUL distribution
  const rulRanges = [
    { label: '0-100 hrs', min: 0, max: 100, color: 'bg-red-500', count: 0 },
    { label: '100-200 hrs', min: 100, max: 200, color: 'bg-amber-500', count: 0 },
    { label: '200-300 hrs', min: 200, max: 300, color: 'bg-yellow-500', count: 0 },
    { label: '300-400 hrs', min: 300, max: 400, color: 'bg-blue-500', count: 0 },
    { label: '400+ hrs', min: 400, max: Infinity, color: 'bg-green-500', count: 0 }
  ];

  predictions.forEach(prediction => {
    const range = rulRanges.find(r => prediction.predictedRUL >= r.min && prediction.predictedRUL < r.max);
    if (range) range.count++;
  });

  const maxCount = Math.max(...rulRanges.map(r => r.count));

  // Sort predictions for trend view
  const sortedPredictions = [...predictions]
    .sort((a, b) => a.predictedRUL - b.predictedRUL)
    .slice(0, 15); // Show top 15 for better visualization

  const maxRUL = Math.max(...sortedPredictions.map(p => p.predictedRUL));

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">RUL Analysis</h3>
          <p className="text-slate-600 text-sm mt-1">
            Visual analysis of motor remaining useful life predictions
          </p>
        </div>
        <div className="flex bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setViewType('distribution')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewType === 'distribution'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Distribution
          </button>
          <button
            onClick={() => setViewType('trend')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewType === 'trend'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Motor Comparison
          </button>
        </div>
      </div>

      {viewType === 'distribution' && (
        <div className="space-y-4">
          <h4 className="font-medium text-slate-700 mb-4">RUL Distribution by Range</h4>
          {rulRanges.map((range, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-24 text-sm text-slate-600 font-medium">
                {range.label}
              </div>
              <div className="flex-1 bg-slate-100 rounded-full h-8 relative">
                <div
                  className={`${range.color} h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500`}
                  style={{ width: `${maxCount > 0 ? (range.count / maxCount) * 100 : 0}%` }}
                >
                  {range.count > 0 && (
                    <span className="text-white text-sm font-medium">
                      {range.count}
                    </span>
                  )}
                </div>
              </div>
              <div className="w-16 text-sm text-slate-600 text-right">
                {range.count} motors
              </div>
            </div>
          ))}
        </div>
      )}

      {viewType === 'trend' && (
        <div className="space-y-4">
          <h4 className="font-medium text-slate-700 mb-4">Motor RUL Comparison (Lowest 15)</h4>
          <div className="space-y-3">
            {sortedPredictions.map((prediction, index) => (
              <div key={prediction.motorId} className="flex items-center space-x-4">
                <div className="w-20 text-sm text-slate-600 font-mono">
                  {prediction.motorId}
                </div>
                <div className="flex-1 bg-slate-100 rounded-full h-6 relative">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      prediction.predictedRUL < 150
                        ? 'bg-red-500'
                        : prediction.predictedRUL < 300
                        ? 'bg-amber-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${(prediction.predictedRUL / maxRUL) * 100}%` }}
                  />
                </div>
                <div className="w-20 text-sm text-slate-800 font-medium text-right">
                  {prediction.predictedRUL}h
                </div>
                <div className="w-16 text-xs text-slate-500 text-right">
                  {prediction.confidenceScore}%
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-4 pt-4 border-t border-slate-200">
            <span>Lowest RUL</span>
            <span>Highest RUL</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RULVisualization;