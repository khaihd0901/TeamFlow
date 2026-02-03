import { Routes, Route, BrowserRouter as Router } from "react-router";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
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
