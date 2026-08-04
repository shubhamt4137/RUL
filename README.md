# Industrial Motor RUL Prediction Application

A comprehensive web application for predicting the Remaining Useful Life (RUL) of industrial motors using machine learning. Built with React frontend and FastAPI backend.

## 🚀 Features

### Frontend (React + TypeScript + TailwindCSS)
- **Clean Dashboard Interface**: Professional landing page with feature overview
- **File Upload System**: Drag-and-drop support for CSV and Excel files
- **Interactive Results Display**: 
  - Sortable prediction tables with pagination
  - Summary statistics and KPIs
  - Custom data visualizations (RUL distribution and motor comparison)
  - Status indicators for maintenance urgency
- **Export Functionality**: Download predictions as CSV
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Error Handling**: Comprehensive validation and user feedback

### Backend (FastAPI + Python)
- **ML-Powered Predictions**: Random Forest regression for RUL calculation
- **Data Processing**: Support for CSV and Excel file formats
- **Data Validation**: Ensures data quality and completeness
- **RESTful API**: Clean endpoints with proper error handling
- **CORS Support**: Configured for frontend integration

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS, Lucide Icons
- **Backend**: FastAPI, pandas, scikit-learn, numpy
- **ML Model**: Random Forest Regressor with feature scaling
- **File Processing**: Support for CSV and Excel formats

## 📋 Requirements

### Data Format
Your uploaded file should contain these columns:
- `motor_id`: Unique identifier for each motor
- `temperature`: Temperature reading in Celsius
- `vibration`: Vibration reading in Hz  
- `pressure`: Pressure reading in Bar
- `rpm`: Motor RPM

## 🚀 Quick Start

### Frontend Setup
```bash
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python api.py
```

The frontend will run on `http://localhost:5173` and backend on `http://localhost:8000`.

## 📊 Sample Data

A sample dataset is provided in `sample_data/motor_data_sample.csv` for testing the application.

## 🔧 Usage

1. **Upload Data**: Drag and drop or select a CSV/Excel file with motor sensor data
2. **View Results**: Analyze predictions with interactive tables and charts
3. **Export Insights**: Download results as CSV for further analysis
4. **Maintenance Planning**: Use urgency indicators to prioritize maintenance

## 🎯 Key Features

### Prediction Results
- Individual motor RUL predictions with confidence scores
- Summary statistics (average, min/max RUL, urgent maintenance count)
- Status categorization (Good, Caution, Urgent)

### Visualizations
- RUL distribution by time ranges
- Motor-by-motor comparison charts
- Maintenance urgency indicators

### Data Export
- CSV export with all prediction results
- Formatted data ready for maintenance planning
- Timestamped files for record keeping

## 🔮 Future Enhancements

- User authentication and multi-tenant support
- Real-time IoT sensor data integration
- Historical trend analysis
- Advanced ML models (ensemble methods, deep learning)
- Cloud deployment (AWS, GCP, Azure)
- Mobile application
- Maintenance schedule automation

## 📚 API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

## 🤝 Production Deployment

For production deployment:
1. Replace the demo Random Forest model with your trained model
2. Configure proper CORS origins
3. Add authentication and rate limiting
4. Implement logging and monitoring
5. Use environment variables for configuration
6. Deploy to cloud infrastructure

## 📄 License

This project is available for educational and commercial use.