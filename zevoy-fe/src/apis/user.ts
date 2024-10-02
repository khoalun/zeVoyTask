import axios from "axios";

import { config } from "@configs";
import { User } from "@models";

export async function login(data: { email: string; password: string }) {
  const result = await axios.post<{ user: User }>(
    `${config.API_ENDPOINT}/users/login`,
    {
      email: data.email,
      password: data.password,
    },
    {
      withCredentials: true,
    },
  );
  return result.data.user;
}

export async function logout() {
  await axios.delete(`${config.API_ENDPOINT}/users/logout`, {
    withCredentials: true,
  });
}

export async function getUser() {
  const result = await axios.get<{ user: User }>(
    `${config.API_ENDPOINT}/users/me`,
    {
      withCredentials: true,
    },
  );
  return result.data.user;
}
