import { fetchJson } from "@/lib/api";

export interface BillResponse {
  id: string;
  orderId: string;
  displayNumber: number;
  tableNumber: number;
  subtotal: number;
  taxAmount: number;
  total: number;
  isPrinted: boolean;
  createdAt: string;
  items: {
    name: string;
    quantity: number;
    priceAtOrder: number;
  }[];
}

export interface GenerateBillRequest {
  orderId: string;
  generatedBy?: string;
}

export async function getBills(): Promise<BillResponse[]> {
  return fetchJson<BillResponse[]>("/api/bills");
}

export async function generateBill(payload: GenerateBillRequest): Promise<BillResponse> {
  return fetchJson<BillResponse>("/api/bills", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}