import { createBrowserRouter } from "react-router";
import { Dashboard } from "./components/Dashboard";
import { PackageResults } from "./components/PackageResults";
import { PackageDetail } from "./components/PackageDetail";
import { QuoteBuilder } from "./components/QuoteBuilder";
import { TripManagement } from "./components/TripManagement";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "packages", Component: PackageResults },
      { path: "package/:id", Component: PackageDetail },
      { path: "quote/:id", Component: QuoteBuilder },
      { path: "trips", Component: TripManagement },
    ],
  },
]);
