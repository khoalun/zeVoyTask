import { Outlet } from "react-router-dom";

import { AppHeader } from "@components";

export function Dashboard() {
  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  );
}
