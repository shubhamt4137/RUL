import React from 'react';
import { Activity, TrendingUp, AlertTriangle, Wrench } from 'lucide-react';

const Dashboard: React.FC = () => {
  const features = [
    {
      icon: Activity,
      title: 'Real-time Analysis',
      description: 'Advanced Random Forest algorithms analyze motor sensor data in real-time'
    },
    {
      icon: TrendingUp,
      title: 'Predictive Insights',
      description: 'Get accurate RUL predictions with confidence scores for informed decision-making'
    },
    {
      icon: AlertTriangle,
      title: 'Early Warning System',
      description: 'Identify motors requiring urgent maintenance before critical failures occur'
    },
    {
      icon: Wrench,
      title: 'Maintenance Optimization',
      description: 'Plan maintenance schedules efficiently based on predicted remaining useful life'
    }
  ];

  return (
    <div className="mb-12">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-300"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <feature.icon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Get Started with Your Motor Data
          </h2>
          <p className="text-slate-600 mb-6">
            Upload a CSV or Excel file containing your motor sensor data (temperature, vibration, pressure, RPM) 
            to generate RUL predictions and maintenance insights.
          </p>
          <div className="inline-flex items-center space-x-4 text-sm text-slate-500">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              CSV Format Supported
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Excel Format Supported
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Instant Processing
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;