export type Transaction = {
  id: string;
  description: string;
  category: string;
  date: string;
  amount: number;
  icon: string;
  color?: string;
};

export type Budget = {
  id: string;
  category: string;
  spent: number;
  limit: number;
  color: string;
  icon: string;
};

export type Insight = {
  id: string;
  title: string;
  description: string;
  type: "opportunity" | "alert" | "info" | "success";
  actionText?: string;
  priority?: "high" | "medium" | "low";
};

export type Alert = {
  id: string;
  merchant: string;
  location: string;
  time: string;
  amount: number;
  riskScore: number;
  cardEnding: string;
  cardType: string;
  status: "critical" | "medium" | "low";
  timestamp: string;
};

export type SpendingDataPoint = {
  name: string;
  amount: number;
};
