import { Route, Routes, BrowserRouter as Router } from "react-router";
import { Toaster } from "sonner";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import { useSocketStore } from "./stores/socketStore";
import { useAuthStore } from "./stores/authStore";
import { useEffect } from "react";
function App() {
  const {connectSocket,disconnectSocket} = useSocketStore();
  const {accessToken} = useAuthStore();

  useEffect(()=>{
    if(accessToken){
      connectSocket();
    }

    return () => disconnectSocket();
  },[accessToken])
  
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
