from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class BatchItem(BaseModel):
    batch_code: str
    product_name: str
    category: str
    cost_price: float
    retail_price: float
    quantity_on_hand: int
    average_daily_sales: float
    expiry_date: str  # ISO format: "2026-01-07"
    
class ConfigThresholds(BaseModel):
    expiring_soon_days: int = 5
    stockout_risk_doc: int = 7
    high_stock_doc: int = 30

class ConfigFormulas(BaseModel):
    markdown: str = "simple"  # "simple" or "advanced"
    markdown_elasticity: float = 1.0

class Config(BaseModel):
    thresholds: ConfigThresholds
    formulas: ConfigFormulas

class MetricPanel(BaseModel):
    metric_name: str
    value: str
    count: int
    badge_type: str
    amount: Optional[str] = None

class DashboardMetrics(BaseModel):
    expiring_soon: MetricPanel
    stockout_risk: MetricPanel
    high_stock: Optional[MetricPanel] = None
    waste_today: Optional[MetricPanel] = None
    gross_profit: Optional[MetricPanel] = None
    sales_today: Optional[MetricPanel] = None

class InventoryItemDetail(BaseModel):
    batch_code: str
    product_name: str
    category: str
    quantity: int
    expiry_date: str
    days_until_expiry: int
    cost_price: float
    retail_price: float
    gross_profit_per_unit: float
    gross_profit_total: float
    average_daily_sales: float
    days_of_coverage: float
    quantity_at_risk: int
    suggested_markdown_percent: float

class ActivityEvent(BaseModel):
    event_type: str  # "sale", "delivery", "waste", "alert"
    title: str
    description: str
    transaction_id: str
    timestamp: str  # ISO format
    amount: Optional[str] = None
    icon_color: str  # "green", "blue", "red", "yellow"
