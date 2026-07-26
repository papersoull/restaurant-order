import { useEffect, useState } from "react";
import { getMenu } from "@/services/menu";
import { MenuCategory } from "@/types/menu";

interface MenuState {
  categories: MenuCategory[];
  isLoading: boolean;
  error: string | null;
}

export function useMenu() {
  const [state, setState] = useState<MenuState>({
    categories: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    getMenu()
      .then((data) => {
        if (!isMounted) return;
        setState({ categories: data.categories, isLoading: false, error: null });
      })
      .catch((error) => {
        if (!isMounted) return;
        setState({ categories: [], isLoading: false, error: error.message || "Failed to load menu" });
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
