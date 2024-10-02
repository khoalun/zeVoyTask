import { useNavigate } from "react-router-dom";

import { login, logout } from "@apis";
import { useUserStore } from "@stores/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBoardStore } from "@stores/board";

export function useLogin() {
  const setUser = useUserStore((state) => state.set);
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const user = await login(data);

      setUser((state) => {
        state.user = user;
      });
    },
  });
}

export function useLogout() {
  const setUser = useUserStore((state) => state.set);
  const resetUser = useUserStore((state) => state.reset);
  const resetBoard = useBoardStore((state) => state.reset);
  const client = useQueryClient();

  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
      await logout();
      setUser((state) => {
        state.user = undefined;
      });
      resetUser();
      resetBoard();
      client.clear();
      navigate("/login");
    },
  });
}
