import json
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Tuple
from models import (
    BatchItem, Config, InventoryItemDetail, MetricPanel,
    DashboardMetrics, ActivityEvent
)
from formulas import Formulas

class BusinessEngine:
    """Orchestrates business logic calculations using formulas and config"""
    
    def __init__(self, config: Config, data_path: str = "data/mock_data.json"):
        self.config = config
        self.data_path = Path(data_path)
        self.formulas = Formulas()
    
    def load_batch_data(self) -> List[BatchItem]:
        """Load batch data from JSON file"""
        try:
            with open(self.data_path, 'r') as f:
                data = json.load(f)
            
            batches = [BatchItem(**batch) for batch in data.get("batches", [])]
            return batches
        except Exception as e:
            print(f"Error loading batch data: {e}")
            return []
    
    def load_activity_data(self) -> List[ActivityEvent]:
        """Load activity data from JSON file"""
        try:
            with open(self.data_path, 'r') as f:
                data = json.load(f)
            
            activities = [ActivityEvent(**activity) for activity in data.get("activities", [])]
            return activities
        except Exception as e:
            print(f"Error loading activity data: {e}")
            return []
    
    def calculate_inventory_details(self, batch: BatchItem) -> InventoryItemDetail:
        """Calculate all derived values for a single batch"""
        
        # Basic calculations
        gross_profit_per_unit = self.formulas.gross_profit(
            batch.retail_price, batch.cost_price
        )
        gross_profit_total = gross_profit_per_unit * batch.quantity_on_hand
        
        days_of_coverage = self.formulas.days_of_coverage(
            batch.quantity_on_hand, batch.average_daily_sales
        )
        
        days_until_expiry = self.formulas.days_until_expiry(batch.expiry_date)
        
        quantity_at_risk = self.formulas.quantity_at_risk(
            batch.quantity_on_hand, batch.average_daily_sales, days_until_expiry
        )
        
        suggested_markdown = self.formulas.suggested_markdown_percent(
            quantity_at_risk, batch.quantity_on_hand,
            self.config.formulas.markdown_elasticity
        )
        
        return InventoryItemDetail(
            batch_code=batch.batch_code,
            product_name=batch.product_name,
            category=batch.category,
            quantity=batch.quantity_on_hand,
            expiry_date=batch.expiry_date,
            days_until_expiry=days_until_expiry,
            cost_price=batch.cost_price,
            retail_price=batch.retail_price,
            gross_profit_per_unit=round(gross_profit_per_unit, 2),
            gross_profit_total=round(gross_profit_total, 2),
            average_daily_sales=batch.average_daily_sales,
            days_of_coverage=round(days_of_coverage, 1),
            quantity_at_risk=quantity_at_risk,
            suggested_markdown_percent=round(suggested_markdown, 1)
        )
    
    def get_dashboard_metrics(self) -> DashboardMetrics:
        """Calculate all 6 metric panels for dashboard"""
        batches = self.load_batch_data()
        
        # Calculate metrics
        expiring_items = []
        stockout_items = []
        total_gross_profit = 0.0
        at_risk_value = 0.0
        stockout_risk_value = 0.0
        
        for batch in batches:
            details = self.calculate_inventory_details(batch)
            
            # Expiring Soon
            if self.formulas.is_expiring_soon(
                details.days_until_expiry,
                self.config.thresholds.expiring_soon_days
            ):
                expiring_items.append(details)
                at_risk_value += details.quantity_at_risk * batch.retail_price
            
            # Stockout Risk
            if self.formulas.is_stockout_risk(
                details.days_of_coverage,
                self.config.thresholds.stockout_risk_doc
            ):
                stockout_items.append(details)
                stockout_risk_value += details.quantity * batch.cost_price
            
            # Gross Profit
            total_gross_profit += details.gross_profit_total
        
        # Format metric panels
        expiring_soon_panel = MetricPanel(
            metric_name="Expiring Soon",
            value=f"${at_risk_value:.2f}",
            count=len(expiring_items),
            badge_type="critical",
            amount="at risk"
        )
        
        stockout_risk_panel = MetricPanel(
            metric_name="Stockout Risk",
            value=f"{len(stockout_items)}",
            count=len(stockout_items),
            badge_type="medium",
            amount="items"
        )
        
        waste_today_panel = MetricPanel(
            metric_name="Waste Today",
            value="$0.00",
            count=0,
            badge_type="warning",
            amount="wasted"
        )
        
        gross_profit_panel = MetricPanel(
            metric_name="Gross Profit",
            value=f"${total_gross_profit:.2f}",
            count=len(batches),
            badge_type="success",
            amount="today"
        )
        
        sales_today_panel = MetricPanel(
            metric_name="Sales Today",
            value="$0.00",
            count=0,
            badge_type="info",
            amount="today"
        )
        
        return DashboardMetrics(
            expiring_soon=expiring_soon_panel,
            stockout_risk=stockout_risk_panel,
            waste_today=waste_today_panel,
            gross_profit=gross_profit_panel,
            sales_today=sales_today_panel
        )
    
    def get_expiring_soon_items(self) -> List[InventoryItemDetail]:
        """Get all items expiring soon"""
        batches = self.load_batch_data()
        items = []
        
        for batch in batches:
            details = self.calculate_inventory_details(batch)
            if self.formulas.is_expiring_soon(
                details.days_until_expiry,
                self.config.thresholds.expiring_soon_days
            ):
                items.append(details)
        
        return sorted(items, key=lambda x: x.days_until_expiry)
    
    def get_stockout_risk_items(self) -> List[InventoryItemDetail]:
        """Get all items at stockout risk"""
        batches = self.load_batch_data()
        items = []
        
        for batch in batches:
            details = self.calculate_inventory_details(batch)
            if self.formulas.is_stockout_risk(
                details.days_of_coverage,
                self.config.thresholds.stockout_risk_doc
            ):
                items.append(details)
        
        return sorted(items, key=lambda x: x.days_of_coverage)
    
    def get_all_inventory_with_calculations(self) -> List[InventoryItemDetail]:
        """Get complete inventory with all calculations"""
        batches = self.load_batch_data()
        items = [self.calculate_inventory_details(batch) for batch in batches]
        return sorted(items, key=lambda x: x.days_until_expiry)
    
    def get_activity_feed(self) -> List[ActivityEvent]:
        """Get activity feed events"""
        return self.load_activity_data()

# Add these methods to your BusinessEngine class

def get_profit_analysis(self) -> dict:
    """Get profit analysis with chart data"""
    batches = self.load_batch_data()
    
    products_data = []
    for batch in batches:
        details = self.calculate_inventory_details(batch)
        gross_profit_total = details.gross_profit_total
        margin = (gross_profit_total / (details.retail_price * details.quantity)) * 100 if details.retail_price > 0 else 0
        
        products_data.append({
            "name": batch.product_name,
            "profit": round(gross_profit_total, 2),
            "margin": round(margin, 1),
            "revenue": round(details.retail_price * details.quantity, 2),
            "cogs": round(details.cost_price * details.quantity, 2),
            "units_sold": details.quantity
        })
    
    # Sort by profit descending
    products_data.sort(key=lambda x: x["profit"], reverse=True)
    
    return {
        "products": products_data[:10],  # Top 10 products
        "total_profit": round(sum(p["profit"] for p in products_data), 2),
        "average_margin": round(sum(p["margin"] for p in products_data) / len(products_data), 1) if products_data else 0
    }

def get_price_rules(self) -> list:
    """Get all price rules"""
    try:
        with open(self.data_path, 'r') as f:
            data = json.load(f)
        return data.get("price_rules", [])
    except:
        return [
            {
                "id": "RULE-001",
                "name": "Near Expiry - 20% Off",
                "type": "near-expiry",
                "active": True,
                "priority": 1,
                "days_threshold": 3,
                "discount_percent": 20,
                "description": "20% discount when 3 days to expiry"
            },
            {
                "id": "RULE-002",
                "name": "Near Expiry - 50% Off",
                "type": "near-expiry",
                "active": True,
                "priority": 2,
                "days_threshold": 1,
                "discount_percent": 50,
                "description": "50% discount when 1 days to expiry"
            }
        ]

def create_price_rule(self, rule: dict) -> dict:
    """Create a new price rule"""
    try:
        with open(self.data_path, 'r') as f:
            data = json.load(f)
        
        if "price_rules" not in data:
            data["price_rules"] = []
        
        new_id = f"RULE-{len(data['price_rules']) + 1:03d}"
        rule["id"] = new_id
        data["price_rules"].append(rule)
        
        with open(self.data_path, 'w') as f:
            json.dump(data, f, indent=2)
        
        return {"success": True, "rule": rule}
    except Exception as e:
        return {"success": False, "error": str(e)}

def update_price_rule(self, rule_id: str, rule: dict) -> dict:
    """Update a price rule"""
    try:
        with open(self.data_path, 'r') as f:
            data = json.load(f)
        
        for i, existing in enumerate(data.get("price_rules", [])):
            if existing["id"] == rule_id:
                rule["id"] = rule_id
                data["price_rules"][i] = rule
                break
        
        with open(self.data_path, 'w') as f:
            json.dump(data, f, indent=2)
        
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}

def delete_price_rule(self, rule_id: str) -> dict:
    """Delete a price rule"""
    try:
        with open(self.data_path, 'r') as f:
            data = json.load(f)
        
        data["price_rules"] = [r for r in data.get("price_rules", []) if r["id"] != rule_id]
        
        with open(self.data_path, 'w') as f:
            json.dump(data, f, indent=2)
        
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}

def get_recent_transactions(self) -> list:
    """Get recent transactions"""
    try:
        with open(self.data_path, 'r') as f:
            data = json.load(f)
        return data.get("transactions", [])
    except:
        return [
            {"id": "TXN-20260106-001", "date": "2026-05-19", "time": "06:45 PM", "payment": "cash", "items_count": 3, "total": 71.89},
            {"id": "TXN-20260105-001", "date": "2026-05-18", "time": "02:30 PM", "payment": "card", "items_count": 2, "total": 45.50},
            {"id": "TXN-20260104-002", "date": "2026-05-17", "time": "09:20 PM", "payment": "cash", "items_count": 1, "total": 12.99},
            {"id": "TXN-20260104-001", "date": "2026-05-17", "time": "03:20 PM", "payment": "card", "items_count": 1, "total": 8.99},
            {"id": "TXN-20260103-002", "date": "2026-05-16", "time": "08:45 PM", "payment": "cash", "items_count": 2, "total": 23.98}
        ]

def get_products(self) -> list:
    """Get all products for POS"""
    batches = self.load_batch_data()
    products = []
    for batch in batches:
        products.append({
            "id": batch.batch_code,
            "name": batch.product_name,
            "category": batch.category,
            "barcode": f"789{batch.batch_code[-10:]}",
            "price": batch.retail_price,
            "cost": batch.cost_price,
            "quantity": batch.quantity_on_hand
        })
    return products

def create_pos_transaction(self, transaction: dict) -> dict:
    """Create a new POS transaction"""
    try:
        with open(self.data_path, 'r') as f:
            data = json.load(f)
        
        if "transactions" not in data:
            data["transactions"] = []
        
        # Add activity feed entry
        if "activities" not in data:
            data["activities"] = []
        
        data["activities"].append({
            "event_type": "sale",
            "title": "POS Sale",
            "description": f"Transaction {transaction['id']}: ${transaction['total']}",
            "transaction_id": transaction['id'],
            "timestamp": transaction['timestamp'],
            "amount": f"+${transaction['total']}",
            "icon_color": "green"
        })
        
        data["transactions"].append(transaction)
        
        with open(self.data_path, 'w') as f:
            json.dump(data, f, indent=2)
        
        return {"success": True, "transaction": transaction}
    except Exception as e:
        return {"success": False, "error": str(e)}