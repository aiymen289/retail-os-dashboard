from datetime import datetime
from typing import Optional

class Formulas:
    """Pure calculation formulas - no side effects, no state"""
    
    @staticmethod
    def gross_profit(retail_price: float, cost_price: float) -> float:
        """
        Gross Profit = Retail Price - Cost Price
        """
        return max(0, retail_price - cost_price)
    
    @staticmethod
    def days_of_coverage(on_hand_qty: int, average_daily_sales: float) -> float:
        """
        Days of Coverage (DOC) = On Hand Inventory ÷ Average Daily Sales
        Returns 999 if average_daily_sales is 0 (infinite coverage)
        """
        if average_daily_sales <= 0:
            return 999.0
        return on_hand_qty / average_daily_sales
    
    @staticmethod
    def days_until_expiry(expiry_date_str: str) -> int:
        """
        Days Until Expiry = Expiry Date - Today
        Returns negative if already expired
        """
        try:
            expiry_date = datetime.fromisoformat(expiry_date_str)
            today = datetime.now()
            delta = (expiry_date - today).days
            return delta
        except:
            return 0
    
    @staticmethod
    def quantity_at_risk(on_hand_qty: int, average_daily_sales: float, days_until_expiry: int) -> int:
        """
        Quantity at Risk = Max(0, On Hand - (Avg Daily Sales × Days Until Expiry))
        Items that won't sell before expiry
        """
        if days_until_expiry <= 0:
            return on_hand_qty  # All at risk if already expired
        
        qty_will_sell = average_daily_sales * days_until_expiry
        at_risk = max(0, on_hand_qty - qty_will_sell)
        return int(at_risk)
    
    @staticmethod
    def suggested_markdown_percent(quantity_at_risk: int, on_hand_qty: int, elasticity: float = 1.0) -> float:
        """
        Suggested Markdown % = (Quantity at Risk ÷ On Hand) × 100 × Elasticity
        Elasticity allows admin to adjust aggressiveness (1.0 = standard)
        """
        if on_hand_qty <= 0:
            return 0.0
        
        base_markdown = (quantity_at_risk / on_hand_qty) * 100
        adjusted_markdown = base_markdown * elasticity
        return min(100.0, adjusted_markdown)  # Cap at 100%
    
    @staticmethod
    def is_expiring_soon(days_until_expiry: int, threshold: int) -> bool:
        """
        Check if item is expiring soon based on threshold
        """
        return 0 <= days_until_expiry <= threshold
    
    @staticmethod
    def is_expired(days_until_expiry: int) -> bool:
        """
        Check if item is already expired
        """
        return days_until_expiry < 0
    
    @staticmethod
    def is_stockout_risk(days_of_coverage: float, threshold: int) -> bool:
        """
        Check if DOC is below threshold (stockout risk)
        """
        return 0 < days_of_coverage <= threshold
    
    @staticmethod
    def is_high_stock(days_of_coverage: float, threshold: int) -> bool:
        """
        Check if DOC is above threshold (overstocked)
        """
        return days_of_coverage > threshold
