from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from models import (
    Config, DashboardMetrics, InventoryItemDetail,
    ActivityEvent, ConfigThresholds, ConfigFormulas
)
from config import ConfigManager
from engine import BusinessEngine

app = FastAPI(title="Retail OS Business Engine", version="1.0.0")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize managers
config_manager = ConfigManager("data/config.json")

# Get initial config
current_config = config_manager.load()
business_engine = BusinessEngine(current_config, "data/mock_data.json")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "service": "Retail OS Business Engine"}

@app.get("/api/config")
async def get_config() -> dict:
    """Get current configuration"""
    return config_manager.get_dict()

@app.post("/api/config")
async def update_config(config: Config) -> dict:
    """Update configuration (admin endpoint)"""
    global current_config, business_engine
    
    success = config_manager.save(config)
    if success:
        current_config = config
        business_engine = BusinessEngine(current_config, "data/mock_data.json")
        return {"success": True, "message": "Config updated successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to save config")

@app.get("/api/dashboard-metrics")
async def get_dashboard_metrics() -> DashboardMetrics:
    """Get all 6 metric panels for dashboard"""
    return business_engine.get_dashboard_metrics()

@app.get("/api/inventory/all")
async def get_all_inventory() -> List[InventoryItemDetail]:
    """Get complete inventory with all calculations"""
    return business_engine.get_all_inventory_with_calculations()

@app.get("/api/inventory/expiring-soon")
async def get_expiring_soon() -> List[InventoryItemDetail]:
    """Get items expiring soon based on current threshold"""
    return business_engine.get_expiring_soon_items()

@app.get("/api/inventory/stockout-risk")
async def get_stockout_risk() -> List[InventoryItemDetail]:
    """Get items at stockout risk based on current threshold"""
    return business_engine.get_stockout_risk_items()

@app.get("/api/activity-feed")
async def get_activity_feed() -> List[ActivityEvent]:
    """Get activity feed events"""
    return business_engine.get_activity_feed()

# Add these new endpoints to your existing main.py

@app.get("/api/profit-analysis")
async def get_profit_analysis():
    """Get profit analysis with chart data"""
    return business_engine.get_profit_analysis()

@app.get("/api/price-rules")
async def get_price_rules():
    """Get all price rules"""
    return business_engine.get_price_rules()

@app.post("/api/price-rules")
async def create_price_rule(rule: dict):
    """Create a new price rule"""
    return business_engine.create_price_rule(rule)

@app.put("/api/price-rules/{rule_id}")
async def update_price_rule(rule_id: str, rule: dict):
    """Update an existing price rule"""
    return business_engine.update_price_rule(rule_id, rule)

@app.delete("/api/price-rules/{rule_id}")
async def delete_price_rule(rule_id: str):
    """Delete a price rule"""
    return business_engine.delete_price_rule(rule_id)

@app.get("/api/recent-transactions")
async def get_recent_transactions():
    """Get recent transactions"""
    return business_engine.get_recent_transactions()

@app.get("/api/products")
async def get_products():
    """Get all products for POS"""
    return business_engine.get_products()

@app.post("/api/pos-transaction")
async def create_pos_transaction(transaction: dict):
    """Create a new POS transaction"""
    return business_engine.create_pos_transaction(transaction)

    # Add these new endpoints to your main.py file

@app.get("/api/products")
async def get_products():
    """Get all products for POS"""
    return business_engine.get_products()

@app.get("/api/profit-analysis")
async def get_profit_analysis():
    """Get profit analysis with chart data"""
    return business_engine.get_profit_analysis()

@app.get("/api/price-rules")
async def get_price_rules():
    """Get all price rules"""
    return business_engine.get_price_rules()

@app.post("/api/price-rules")
async def create_price_rule(rule: dict):
    """Create a new price rule"""
    return business_engine.create_price_rule(rule)

@app.put("/api/price-rules/{rule_id}")
async def update_price_rule(rule_id: str, rule: dict):
    """Update an existing price rule"""
    return business_engine.update_price_rule(rule_id, rule)

@app.delete("/api/price-rules/{rule_id}")
async def delete_price_rule(rule_id: str):
    """Delete a price rule"""
    return business_engine.delete_price_rule(rule_id)

@app.get("/api/recent-transactions")
async def get_recent_transactions():
    """Get recent transactions"""
    return business_engine.get_recent_transactions()

@app.post("/api/pos-transaction")
async def create_pos_transaction(transaction: dict):
    """Create a new POS transaction"""
    return business_engine.create_pos_transaction(transaction)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
