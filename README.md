# Retail OS Backend - Python FastAPI Service

Complete backend service for the Retail OS Dashboard with business logic, calculations, and configuration management.

## Overview

This is a FastAPI-based backend service that provides all business logic and calculations for the Retail OS Dashboard. It handles:

- Dashboard metric calculations (sales, profit, waste, expiry)
- Inventory management and batch tracking
- Activity feed and transaction history
- Admin configuration management
- All business rules and formulas

## Features

- **8 REST API Endpoints** with full documentation
- **9 Pure Calculation Functions** (no hardcoding)
- **JSON-based Configuration** (easily switch to database)
- **Type-Safe with Pydantic** models
- **CORS Enabled** for frontend integration
- **Swagger UI** at `/docs`

## Getting Started

### Prerequisites
- Python 3.8+
- pip or conda

### Installation

```bash
# Install dependencies
pip install -r requirements.txt

# Start the server
python main.py
```

Server runs on: `http://localhost:8000`
API Docs: `http://localhost:8000/docs`

## Project Structure

```
python-service/
├── main.py              # FastAPI application
├── models.py            # Pydantic data models
├── formulas.py          # Calculation functions
├── config.py            # Configuration manager
├── engine.py            # Business logic engine
├── data/
│   ├── config.json      # Editable business rules
│   └── mock_data.json   # Sample data
└── requirements.txt
```

## API Endpoints

### Dashboard Metrics
```
GET /api/dashboard-metrics
```
Returns all calculated metrics:
- `sales_today` - Daily sales value
- `gross_profit` - Profit margin percentage
- `waste_today` - Waste value
- `expiring_soon` - Items expiring within 5 days
- `stockout_risk` - Low stock items

### Batch Data
```
GET /api/batch-data
```
Returns inventory batches with calculated fields:
- `batch_code` - Unique batch identifier
- `product_name` - Product name
- `quantity` - Current stock quantity
- `expiry_date` - Expiration date
- `days_until_expiry` - Calculated days remaining
- `at_risk_qty` - Markdown calculation
- `retail_price` - Price at risk

### Activity Feed
```
GET /api/activity-feed
```
Returns transaction history:
- `transaction_id` - Unique ID
- `event_type` - Type of event (sale, delivery, waste, alert)
- `title` - Event title
- `description` - Event description
- `amount` - Transaction amount
- `timestamp` - Event timestamp

### Configuration
```
GET /api/config
POST /api/config
```
Get or update all configuration settings

### Specific Metric Details
```
GET /api/metrics/{metric_type}
```
Get detailed breakdown for a specific metric

### Health Check
```
GET /health
```
Returns service status

## Configuration File (data/config.json)

Control all business rules without changing code:

```json
{
  "metrics": {
    "expiry_threshold_days": 5,
    "stockout_threshold_qty": 10
  },
  "calculations": {
    "markdown_formula": "quantity * retail_price * 0.3",
    "gross_margin_type": "simple",
    "elasticity_factor": 0.85
  }
}
```

### Available Settings

- `expiry_threshold_days` - Days until expiry to flag as critical (default: 5)
- `stockout_threshold_qty` - Stock quantity threshold for stockout alert (default: 10)
- `markdown_formula` - Formula for calculating markdown amount
- `gross_margin_type` - "simple" or "advanced" calculation
- `elasticity_factor` - Factor for demand elasticity calculations

## Calculation Formulas (formulas.py)

All calculations are pure functions with no side effects:

### Sales Calculation
```python
calculate_sales(transactions: List[Dict]) -> float
```
Sums all sale transactions for the day

### Profit Calculation
```python
calculate_gross_profit(sales: float, cost: float) -> float
```
Returns (sales - cost) / sales * 100

### Waste Calculation
```python
calculate_waste(waste_items: List[Dict]) -> float
```
Sums all waste transactions

### Expiry Calculation
```python
calculate_days_to_expiry(expiry_date: str) -> int
```
Returns days until expiration

### At-Risk Quantity
```python
calculate_at_risk_qty(batch: Dict, config: Dict) -> float
```
Applies markdown formula to calculate at-risk value

## Business Logic Engine (engine.py)

Orchestrates all calculations:

```python
engine = Engine()

# Get all metrics
metrics = engine.get_all_metrics()

# Get specific metric with details
metric_data = engine.get_metric_details('expiring_soon')

# Get batch data with calculations
batches = engine.get_batch_data()
```

## Configuration Manager (config.py)

Load and save configuration:

```python
from config import ConfigManager

config_mgr = ConfigManager()

# Load config
config = config_mgr.load_config()

# Update config
config_mgr.update_config(new_config)
```

## Adding New Features

### Step 1: Add Formula
Add function to `formulas.py`:
```python
def my_new_calculation(data: Dict) -> float:
    """Calculate something new."""
    return result
```

### Step 2: Update Engine
Update `engine.py` to use the formula:
```python
def get_my_metric(self):
    # Process data
    result = formulas.my_new_calculation(data)
    return result
```

### Step 3: Expose Endpoint
Add endpoint to `main.py`:
```python
@app.get("/api/my-metric")
def get_my_metric():
    return engine.get_my_metric()
```

### Step 4: Update Config
Add settings to `data/config.json` if needed

## Troubleshooting

### Port already in use
```bash
# Kill the process on port 8000
lsof -ti:8000 | xargs kill -9
python main.py
```

### Import errors
```bash
# Reinstall dependencies
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

### JSON parsing errors
Validate `data/config.json` and `data/mock_data.json` with a JSON validator

## Testing

Run the backend independently:
```bash
# Start the server
python main.py

# In another terminal, test endpoints
curl http://localhost:8000/health
curl http://localhost:8000/api/dashboard-metrics
curl http://localhost:8000/docs  # Interactive docs
```

## Environment Variables

None required for local development. For production:

```bash
BACKEND_PORT=8000
BACKEND_HOST=0.0.0.0
DATABASE_URL=  # For future database integration
```

## Next Steps

1. Review the calculation functions in `formulas.py`
2. Check configuration options in `data/config.json`
3. Explore the API at `/docs`
4. Connect with the frontend at `frontend/next-app/`
5. Add database integration when ready

---

For full project documentation, see `../../QUICK_START.md`
