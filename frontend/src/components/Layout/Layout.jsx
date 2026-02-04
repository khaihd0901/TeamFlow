import React from "react";
import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="h-screen">
      <div className="bg-gray-100">
        <div className="bg-gray-300 px-4 border-b-2 border-gray-400">
          <Header />
        </div>
        <div className="px-4 py-4 h-[calc(100vh-3.5rem)] ">
          <Outlet />
        </div>
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default Layout;
