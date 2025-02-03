import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import PrivateRoute from "@/components/private-route";
import { routes } from "./routes";
import { IStaticMethods } from "flyonui/flyonui";
import "./App.css";
import useMenuStore from "./store/menu-store";
import useAuthStore from "./store/auth-store";

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

function App() {
  const { token } = useAuthStore();
  const { loadCartFromCookies } = useMenuStore();
  const location = useLocation();

  useEffect(() => {
    const loadFlyonui = async () => {
      await import("flyonui/flyonui");
      window.HSStaticMethods.autoInit();
    };
    loadFlyonui();
  }, [location.pathname]);

  useEffect(() => {
    loadCartFromCookies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="quicksand-fonts">
        <Routes>
          {routes.map(({ path, element, isPrivate }) =>
            isPrivate ? (
              <Route
                key={path}
                element={<PrivateRoute isAuthenticated={!!token} />}
              >
                <Route path={path} element={element} />
              </Route>
            ) : (
              <Route key={path} path={path} element={element} />
            )
          )}
        </Routes>
      </div>
    </>
  );
}

export default function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}
