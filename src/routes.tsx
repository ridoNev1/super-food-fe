import HomePage from "@/pages/homepage";
import HistoryOrder from "./pages/history-order";
import AdminDashboard from "./pages/admin-dashboard";

export const routes = [
  { path: "/", element: <HomePage />, isPrivate: false },
  { path: "/history-order", element: <HistoryOrder />, isPrivate: true },
  { path: "/admin-dashboard", element: <AdminDashboard />, isPrivate: true },
];
