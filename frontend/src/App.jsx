import { Route, Routes, BrowserRouter as Router } from "react-router";
import { Toaster } from "sonner";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <Toaster richColors />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Layout />}>
            <Route element={<ProtectedRoute />}>
              <Route index element={<HomePage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
