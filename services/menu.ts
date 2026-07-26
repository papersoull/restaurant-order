import { fetchJson } from "@/lib/api";
import { MenuResponse } from "@/types/menu";

export async function getMenu(): Promise<MenuResponse> {
  return fetchJson<MenuResponse>('/api/menu');
}
