// Common types shared across multiple modules

export interface HistoryItem {
  id: number;
  quote_id: number;
  user_id: number;
  event_type: string;
  event_category: string;
  description: string;
  event_metadata: {
    status?: string;
    quote_number?: string;
    total_amount?: string;
    customer_name?: string;
    [key: string]: any;
  };
  created_at: string;
}
