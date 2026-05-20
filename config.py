import json
import os
from pathlib import Path
from models import Config, ConfigThresholds, ConfigFormulas
from typing import Dict, Any

class ConfigManager:
    """Manages loading and saving configuration from JSON"""
    
    def __init__(self, config_path: str = "data/config.json"):
        self.config_path = Path(config_path)
        self.config_path.parent.mkdir(parents=True, exist_ok=True)
        self._ensure_config_exists()
    
    def _ensure_config_exists(self):
        """Create default config if it doesn't exist"""
        if not self.config_path.exists():
            default_config = {
                "thresholds": {
                    "expiring_soon_days": 5,
                    "stockout_risk_doc": 7,
                    "high_stock_doc": 30
                },
                "formulas": {
                    "markdown": "simple",
                    "markdown_elasticity": 1.0
                }
            }
            with open(self.config_path, 'w') as f:
                json.dump(default_config, f, indent=2)
    
    def load(self) -> Config:
        """Load config from JSON file"""
        try:
            with open(self.config_path, 'r') as f:
                data = json.load(f)
            
            thresholds = ConfigThresholds(**data.get("thresholds", {}))
            formulas = ConfigFormulas(**data.get("formulas", {}))
            return Config(thresholds=thresholds, formulas=formulas)
        except Exception as e:
            print(f"Error loading config: {e}")
            return Config(
                thresholds=ConfigThresholds(),
                formulas=ConfigFormulas()
            )
    
    def save(self, config: Config) -> bool:
        """Save config to JSON file"""
        try:
            data = {
                "thresholds": config.thresholds.model_dump(),
                "formulas": config.formulas.model_dump()
            }
            with open(self.config_path, 'w') as f:
                json.dump(data, f, indent=2)
            return True
        except Exception as e:
            print(f"Error saving config: {e}")
            return False
    
    def get_dict(self) -> Dict[str, Any]:
        """Get config as dictionary"""
        config = self.load()
        return {
            "thresholds": config.thresholds.model_dump(),
            "formulas": config.formulas.model_dump()
        }
