import { Draft, produce } from "immer";
import { create } from "zustand";

import { User } from "@models";

export interface UserState {
  user?: User;
  set: (cb: (state: Draft<UserState>) => void) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentType: undefined,
  set: (cb: (state: Draft<UserState>) => void) => {
    set(produce(cb));
  },
  reset: () => {
    set({ user: undefined });
  },
}));
