import { React, useEffect, useRef, useState } from "react";
import {
  Bell,
  CircleQuestionMark,
  LogOutIcon,
  LucideMenu,
  PlusIcon,
  SearchIcon,
  UserCircle2Icon,
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";

const Header = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { authLogout, user } = useAuthStore();
  const handleLogout = async () => {
    await authLogout();
  };
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return (
    <header className="h-16 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 mx-3">
        <LucideMenu />
        <h1 className="text-lg font-bold">TeamFlow</h1>
      </div>
      <div className="flex w-lg relative">
        <input
          type="text"
          className="w-full bg-white px-2 py-2 rounded outline-none focus:ring-1 focus:ring-gray-500"
          placeholder="Search..."
        />
        <SearchIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer" />
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center justify-center px-2 py-2 gap-1 cursor-pointer bg-gray-100 rounded border-gray-300 hover:bg-gray-200 hover:ring-1 hover:ring-gray-500 transition">
          <span className="text-sm text-gray-800 font-semibold">Create</span>
          <PlusIcon className="w-4 text-gray-800" />
        </div>
        <div className="flex items-center">
          <div className=" relative w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded cursor-pointer transition-colors duration-200">
            <Bell />
            <div className="w-3 h-3 bg-red-500 rounded-full absolute top-1 right-2"></div>
          </div>
          <div className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded cursor-pointer transition-colors duration-200">
            <CircleQuestionMark />
          </div>
          <div
            ref={ref}
            onClick={() => setOpen(!open)}
            className="w-10 h-10 relative flex items-center justify-center hover:bg-gray-100 rounded cursor-pointer transition-colors duration-200"
          >
            <UserCircle2Icon />
            {/* Dropdown */}
            {open && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-1 top-14 w-72 rounded-lg bg-white shadow-lg text-sm z-50"
              >
                {/* Account */}
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-2">Account</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-semibold">
                      QK
                    </div>
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-gray-500 text-xs">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center"></div>
                </div>
                <div className="h-px bg-gray-300 my-1"></div>
                {/* Settings */}
                <div className="p-2 my-1 hover:bg-gray-100 cursor-pointer flex items-center justify-between px-4 rounded">
                  <p className="text-sm">Settings & Privacy</p>
                </div>
                <div className="h-px bg-gray-300 my-1"></div>

                <div
                  className="p-2 my-1 hover:bg-gray-100 cursor-pointer flex items-center justify-between px-4 rounded"
                  onClick={handleLogout}
                >
                  <p className="text-sm text-red-500">Logout</p>
                  <LogOutIcon className="w-5 text-red-500" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
