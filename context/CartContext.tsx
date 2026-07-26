"use client";

import React, { createContext, useContext, useMemo, useReducer } from "react";

export interface CartItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstruction?: string;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { itemId: string } }
  | { type: "UPDATE_QUANTITY"; payload: { itemId: string; quantity: number } }
  | { type: "CLEAR_CART" };

interface CartContextValue {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const initialState: CartState = {
  items: [],
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.itemId === action.payload.itemId
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.itemId === action.payload.itemId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.itemId !== action.payload.itemId),
      };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.itemId === action.payload.itemId
              ? { ...item, quantity: action.payload.quantity }
              : item
          )
          .filter((item) => item.quantity > 0),
      };
    case "CLEAR_CART":
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const value = useMemo(() => {
    const totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = state.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return {
      items: state.items,
      totalQuantity,
      totalAmount,
      addItem: (item: CartItem) => dispatch({ type: "ADD_ITEM", payload: item }),
      removeItem: (itemId: string) =>
        dispatch({ type: "REMOVE_ITEM", payload: { itemId } }),
      updateQuantity: (itemId: string, quantity: number) =>
        dispatch({ type: "UPDATE_QUANTITY", payload: { itemId, quantity } }),
      clearCart: () => dispatch({ type: "CLEAR_CART" }),
    };
  }, [state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
