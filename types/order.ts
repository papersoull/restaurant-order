export interface OrderItemDetails {
  name: string;
  quantity: number;
  priceAtOrder: number;
  specialInstruction?: string | null;
}

export interface OrderTrackingResponse {
  id: string;
  displayNumber: number;
  status: string;
  placedAt: string;
  estimatedMinutes: number | null;
  tableNumber: number;
  tableQrToken: string;
  items: OrderItemDetails[];
}
