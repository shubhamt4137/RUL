import React from 'react';
import { PredictionSummary } from '../types';
import { Activity, TrendingUp, AlertTriangle, Wrench } from 'lucide-react';

interface SummaryStatsProps {
  summary: PredictionSummary;
}

const SummaryStats: React.FC<SummaryStatsProps> = ({ summary }) => {
  const stats = [
    {
      label: 'Total Motors',
      value: summary.totalMotors,
      icon: Activity,
      color: 'blue',
      suffix: 'units'
    },
    {
      label: 'Average RUL',
      value: summary.averageRUL,
      icon: TrendingUp,
      color: 'emerald',
      suffix: 'hours'
    },
    {
      label: 'Range',
      value: `${summary.minRUL} - ${summary.maxRUL}`,
      icon: Activity,
      color: 'purple',
      suffix: 'hours'
    },
    {
      label: 'Urgent Maintenance',
      value: summary.urgentMaintenanceCount,
      icon: AlertTriangle,
      color: 'amber',
      suffix: 'motors'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      emerald: 'bg-emerald-100 text-emerald-600',
      purple: 'bg-purple-100 text-purple-600',
      amber: 'bg-amber-100 text-amber-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">Summary Statistics</h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`w-12 h-12 rounded-full ${getColorClasses(stat.color)} flex items-center justify-center mx-auto mb-3`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-slate-800 mb-1">
              {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
            </div>
            <div className="text-sm text-slate-600 mb-1">{stat.label}</div>
            <div className="text-xs text-slate-500">{stat.suffix}</div>
          </div>
        ))}
      </div>

      {summary.urgentMaintenanceCount > 0 && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800 mb-1">Urgent Maintenance Required</h4>
              <p className="text-amber-700 text-sm">
                {summary.urgentMaintenanceCount} motor{summary.urgentMaintenanceCount > 1 ? 's' : ''} 
                {' '}require{summary.urgentMaintenanceCount === 1 ? 's' : ''} immediate attention 
                with RUL below 150 hours. Schedule maintenance as soon as possible.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryStats;