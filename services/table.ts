import { fetchJson } from "@/lib/api";
import { TableResponse } from "@/types/table";

export async function getTable(qrToken: string): Promise<TableResponse> {
  return fetchJson<TableResponse>(`/api/table/${encodeURIComponent(qrToken)}`);
}
