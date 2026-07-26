export interface MenuItem {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
  displayOrder: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  displayOrder: number;
  items: MenuItem[];
}

export interface MenuResponse {
  categories: MenuCategory[];
}
