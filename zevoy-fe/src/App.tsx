import {
  createHashRouter,
  createRoutesFromElements,
  Outlet,
  redirect,
  Route,
  RouterProvider,
} from "react-router-dom";

import { getUser } from "@apis";
import { Toaster } from "@components";
import { useUserStore } from "@stores/user";

import AppProvider from "./providers/AppProviders";

function Root() {
  return (
    <AppProvider>
      <Outlet />
      <Toaster />
    </AppProvider>
  );
}

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route
        path="/app"
        lazy={async () => {
          const { Dashboard } = await import("@layouts/Dashboard");
          return { Component: Dashboard };
        }}
        loader={async () => {
          const user = useUserStore.getState().user;
          if (!user) {
            return redirect("/login");
          }
          return null;
          return null;
        }}
      >
        <Route
          index
          lazy={async () => {
            const { HomePage } = await import("@pages/Home");
            return { Component: HomePage };
          }}
        />
      </Route>
      <Route
        path="/login"
        lazy={async () => {
          const { LoginPage } = await import("@pages/Login");
          return { Component: LoginPage };
        }}
        loader={async () => {
          try {
            const user = await getUser();
            if (user) {
              useUserStore.setState({ user });
              return redirect("/app");
            }
          } catch (error) {
            return null;
          }
        }}
      />
      <Route
        index
        loader={async () => {
          return redirect("/app");
        }}
      />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
