import { Navigate, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Products from "./pages/Products";

import ProtectedRoute from "./components/ProtectedRoute";

import { useAuth } from "./context/AuthContext";

function App() {
    const { isAuthenticated } =
      useAuth();

  return (
    <Routes>
      <Route
              path="/"
              element={
                <Navigate
                  to={
                    isAuthenticated
                      ? "/products"
                      : "/login"
                  }
                  replace
                />
              }
          />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
                    path="/products"
                    element={
                      <ProtectedRoute>
                        <Products />
                      </ProtectedRoute>
                    }
                  />
    </Routes>
  );
}

export default App;