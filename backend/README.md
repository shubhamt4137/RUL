# Motor RUL Prediction Backend

This FastAPI backend provides machine learning-based predictions for industrial motor Remaining Useful Life (RUL).

## Features

- **File Upload Processing**: Handles CSV and Excel files
- **Data Validation**: Ensures data quality and completeness
- **ML Predictions**: Uses Random Forest regression for RUL prediction
- **RESTful API**: Clean API endpoints with proper error handling
- **CORS Support**: Configured for frontend integration

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Run the Server

```bash
python api.py
```

The server will start on `http://localhost:8000`

### 3. API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation.

## API Endpoints

### POST `/predict`
Upload a CSV or Excel file with motor sensor data to get RUL predictions.

**Required columns:**
- `motor_id`: Unique identifier for each motor
- `temperature`: Temperature reading in Celsius
- `vibration`: Vibration reading in Hz
- `pressure`: Pressure reading in Bar
- `rpm`: Motor RPM

**Response:**
```json
{
  "results": [
    {
      "motorId": "MOTOR-001",
      "inputParameters": {
        "temperature": 75,
        "vibration": 125,
        "pressure": 65,
        "rpm": 2100
      },
      "predictedRUL": 287,
      "confidenceScore": 92
    }
  ],
  "summary": {
    "totalMotors": 20,
    "averageRUL": 250,
    "minRUL": 120,
    "maxRUL": 480,
    "urgentMaintenanceCount": 3
  }
}
```

## Model Information

The current implementation uses a Random Forest Regressor trained on synthetic data for demonstration purposes. In production, replace this with your pre-trained model:

1. Train your model on historical motor data
2. Save the model using joblib: `joblib.dump(model, 'motor_rul_model.pkl')`
3. Load the model in the `initialize_model()` function
4. Update the feature preprocessing as needed

## Data Format Example

```csv
motor_id,temperature,vibration,pressure,rpm
MOTOR-001,75,125,65,2100
MOTOR-002,82,118,58,1950
MOTOR-003,68,132,72,2200
```

## Production Considerations

- Replace synthetic model with real trained model
- Add authentication and authorization
- Implement rate limiting
- Add logging and monitoring
- Configure proper CORS origins
- Add input validation and sanitization
- Implement model versioning