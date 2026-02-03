import React from "react";
import { useAuthStore } from "../../stores/authStore";

const Header = () => {
  const { authLogout } = useAuthStore();
  const handleLogout = async () => {
    await authLogout();
  };
  return (
    <div>
      Header
      <button onClick={handleLogout}>logout</button>
    </div>
  );
};

export default Header;
