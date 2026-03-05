import { createBrowserRouter } from "react-router";
import { Dashboard } from "./components/Dashboard";
import { PackageResults } from "./components/PackageResults";
import { PackageDetail } from "./components/PackageDetail";
import { QuoteBuilder } from "./components/QuoteBuilder";
import { TripManagement } from "./components/TripManagement";
import { BillingConfirmation } from "./components/BillingConfirmation";
import { TripConfirmation } from "./components/TripConfirmation";
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
      { path: "billing", Component: BillingConfirmation },
      { path: "trip-confirmed", Component: TripConfirmation },
      { path: "trips", Component: TripManagement },
    ],
  },
]);
