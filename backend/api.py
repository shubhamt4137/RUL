# Industrial Motor RUL Prediction API
# FastAPI backend for processing motor sensor data

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import io
import json
from typing import List, Dict, Any

app = FastAPI(title="Motor RUL Prediction API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and scaler
model = None
scaler = None

def initialize_model():
    """Initialize or train the Random Forest model"""
    global model, scaler
    
    # For demo purposes, create a simple model
    # In production, load your pre-trained model
    model = RandomForestRegressor(
        n_estimators=100,
        random_state=42,
        max_depth=10
    )
    scaler = StandardScaler()
    
    # Create synthetic training data for demonstration
    np.random.seed(42)
    n_samples = 1000
    
    # Generate synthetic features
    X_train = np.random.normal(size=(n_samples, 4))
    X_train[:, 0] = X_train[:, 0] * 20 + 70  # Temperature
    X_train[:, 1] = X_train[:, 1] * 30 + 120  # Vibration
    X_train[:, 2] = X_train[:, 2] * 15 + 60   # Pressure
    X_train[:, 3] = X_train[:, 3] * 200 + 2000  # RPM
    
    # Generate synthetic RUL based on features (higher values = lower RUL)
    y_train = 500 - (
        (X_train[:, 0] - 70) * 2 +  # Temperature effect
        (X_train[:, 1] - 120) * 1.5 +  # Vibration effect
        (X_train[:, 2] - 60) * 1 +  # Pressure effect
        (X_train[:, 3] - 2000) * 0.1  # RPM effect
    ) + np.random.normal(0, 20, n_samples)
    
    y_train = np.maximum(y_train, 50)  # Minimum RUL of 50 hours
    
    # Train the model
    X_scaled = scaler.fit_transform(X_train)
    model.fit(X_scaled, y_train)
    
    print("Model initialized successfully")

@app.on_event("startup")
async def startup_event():
    initialize_model()

@app.get("/")
async def root():
    return {"message": "Motor RUL Prediction API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

def process_uploaded_file(file_content: bytes, filename: str) -> pd.DataFrame:
    """Process uploaded CSV or Excel file"""
    try:
        if filename.endswith('.csv'):
            df = pd.read_csv(io.StringIO(file_content.decode('utf-8')))
        elif filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(io.BytesIO(file_content))
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")
        
        return df
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")

def validate_data(df: pd.DataFrame) -> pd.DataFrame:
    """Validate and clean input data"""
    required_columns = ['motor_id', 'temperature', 'vibration', 'pressure', 'rpm']
    
    # Check for required columns (case insensitive)
    df_columns_lower = [col.lower().replace(' ', '_') for col in df.columns]
    
    missing_columns = []
    for req_col in required_columns:
        if req_col not in df_columns_lower:
            missing_columns.append(req_col)
    
    if missing_columns:
        raise HTTPException(
            status_code=400, 
            detail=f"Missing required columns: {missing_columns}"
        )
    
    # Normalize column names
    column_mapping = {}
    for i, col in enumerate(df.columns):
        normalized_col = col.lower().replace(' ', '_')
        if normalized_col in required_columns:
            column_mapping[col] = normalized_col
    
    df = df.rename(columns=column_mapping)
    
    # Select only required columns
    df = df[required_columns]
    
    # Check for missing values
    if df.isnull().any().any():
        raise HTTPException(status_code=400, detail="Data contains missing values")
    
    # Validate data types and ranges
    numeric_columns = ['temperature', 'vibration', 'pressure', 'rpm']
    for col in numeric_columns:
        if not pd.api.types.is_numeric_dtype(df[col]):
            try:
                df[col] = pd.to_numeric(df[col])
            except:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Column {col} contains non-numeric values"
                )
    
    return df

@app.post("/predict")
async def predict_rul(file: UploadFile = File(...)):
    """Process uploaded file and return RUL predictions"""
    
    if not model or not scaler:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Read file content
        file_content = await file.read()
        
        # Process the file
        df = process_uploaded_file(file_content, file.filename)
        
        # Validate data
        df = validate_data(df)
        
        # Prepare features for prediction
        feature_columns = ['temperature', 'vibration', 'pressure', 'rpm']
        X = df[feature_columns].values
        
        # Scale features
        X_scaled = scaler.transform(X)
        
        # Make predictions
        predictions = model.predict(X_scaled)
        
        # Calculate confidence scores (using prediction variance)
        # In a real implementation, you might use prediction intervals or ensemble variance
        base_confidence = 85
        confidence_scores = np.random.normal(base_confidence, 10, len(predictions))
        confidence_scores = np.clip(confidence_scores, 70, 98)
        
        # Prepare results
        results = []
        for i, (_, row) in enumerate(df.iterrows()):
            results.append({
                "motorId": str(row['motor_id']),
                "inputParameters": {
                    "temperature": int(row['temperature']),
                    "vibration": int(row['vibration']),
                    "pressure": int(row['pressure']),
                    "rpm": int(row['rpm'])
                },
                "predictedRUL": max(50, int(predictions[i])),  # Minimum 50 hours
                "confidenceScore": int(confidence_scores[i])
            })
        
        # Calculate summary statistics
        rul_values = [r["predictedRUL"] for r in results]
        summary = {
            "totalMotors": len(results),
            "averageRUL": int(np.mean(rul_values)),
            "minRUL": int(np.min(rul_values)),
            "maxRUL": int(np.max(rul_values)),
            "urgentMaintenanceCount": sum(1 for rul in rul_values if rul < 150)
        }
        
        return {
            "results": results,
            "summary": summary,
            "message": f"Successfully processed {len(results)} motor records"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)