export interface MotorPrediction {
  motorId: string;
  inputParameters: {
    temperature: number;
    vibration: number;
    pressure: number;
    rpm: number;
  };
  predictedRUL: number;
  confidenceScore: number;
}

export interface PredictionSummary {
  totalMotors: number;
  averageRUL: number;
  minRUL: number;
  maxRUL: number;
  urgentMaintenanceCount: number;
}

export interface PredictionData {
  results: MotorPrediction[];
  summary: PredictionSummary;
}

export interface UploadedFile {
  name: string;
  size: number;
  uploadTime: Date;
}