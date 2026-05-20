const API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || "http://localhost:8000";

export interface DashboardMetrics {
  expiring_soon: MetricPanel;
  stockout_risk: MetricPanel;
  waste_today?: MetricPanel;
  gross_profit?: MetricPanel;
  sales_today?: MetricPanel;
}

export interface MetricPanel {
  metric_name: string;
  value: string;
  count: number;
  badge_type: string;
  amount?: string;
}

export interface InventoryItemDetail {
  batch_code: string;
  product_name: string;
  category: string;
  quantity: number;
  expiry_date: string;
  days_until_expiry: number;
  cost_price: number;
  retail_price: number;
  gross_profit_per_unit: number;
  gross_profit_total: number;
  average_daily_sales: number;
  days_of_coverage: number;
  quantity_at_risk: number;
  suggested_markdown_percent: number;
}

export interface ActivityEvent {
  event_type: string;
  title: string;
  description: string;
  transaction_id: string;
  timestamp: string;
  amount?: string;
  icon_color: string;
}

export interface Config {
  thresholds: {
    expiring_soon_days: number;
    stockout_risk_doc: number;
    high_stock_doc: number;
  };
  formulas: {
    markdown: string;
    markdown_elasticity: number;
  };
}

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  const response = await fetch(`${API_URL}/api/dashboard-metrics`);
  if (!response.ok) throw new Error("Failed to fetch dashboard metrics");
  return response.json();
}

export async function fetchAllInventory(): Promise<InventoryItemDetail[]> {
  const response = await fetch(`${API_URL}/api/inventory/all`);
  if (!response.ok) throw new Error("Failed to fetch inventory");
  return response.json();
}

export async function fetchExpiringItems(): Promise<InventoryItemDetail[]> {
  const response = await fetch(`${API_URL}/api/inventory/expiring-soon`);
  if (!response.ok) throw new Error("Failed to fetch expiring items");
  return response.json();
}

export async function fetchStockoutRiskItems(): Promise<InventoryItemDetail[]> {
  const response = await fetch(`${API_URL}/api/inventory/stockout-risk`);
  if (!response.ok) throw new Error("Failed to fetch stockout risk items");
  return response.json();
}

export async function fetchActivityFeed(): Promise<ActivityEvent[]> {
  const response = await fetch(`${API_URL}/api/activity-feed`);
  if (!response.ok) throw new Error("Failed to fetch activity feed");
  return response.json();
}

export async function fetchConfig(): Promise<Config> {
  const response = await fetch(`${API_URL}/api/config`);
  if (!response.ok) throw new Error("Failed to fetch config");
  return response.json();
}

export async function updateConfig(config: Config): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_URL}/api/config`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
  if (!response.ok) throw new Error("Failed to update config");
  return response.json();
}
