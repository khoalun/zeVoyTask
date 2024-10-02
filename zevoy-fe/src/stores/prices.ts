import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface PricesState {
  prices: {
    [key: string]: {
      price: number;
      currency: string;
    };
  };
  list: string[];
  set: (
    currency: string,
    data: {
      price: number;
      currency: string;
    }
  ) => void;
}

export const usePrices = create<PricesState>()(
  immer((set) => ({
    prices: {
      USD: {
        price: 10,
        currency: "USD",
      },
      BHT: {
        price: 20,
        currency: "BHT",
      },
    },
    list: ["USD", "BHT", "XXY"],
    set: (currency: string, data: { price: number; currency: string }) => {
      set((state) => {
        state.prices[currency] = data;
      });
    },
  }))
);
