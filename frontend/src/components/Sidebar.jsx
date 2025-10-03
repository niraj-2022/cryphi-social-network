import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import {
  BellIcon,
  HomeIcon,
  ShipWheelIcon,
  UserIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home", icon: <HomeIcon className="size-5 opacity-70" /> },
    {
      to: "/friends",
      label: "Friends",
      icon: <UserIcon className="size-5 opacity-70" />,
    },
    {
      to: "/notifications",
      label: "Notifications",
      icon: <BellIcon className="size-5 opacity-70" />,
    },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
        {/* Logo */}
        <div className="p-5 border-b border-base-300">
          <Link to="/" className="flex items-center gap-2.5">
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              CRYPHI
            </span>
          </Link>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                currentPath === link.to ? "btn-active" : ""
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-base-300 mt-auto">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img src={authUser?.profilePic} alt="User Avatar" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{authUser?.fullName}</p>
              <p className="text-xs text-success flex items-center gap-1">
                <span className="size-2 rounded-full bg-success inline-block" />
                Online
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile toggle button (shows in top-left corner) */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 btn btn-ghost btn-circle"
        onClick={() => setIsOpen(true)}
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      {/* Mobile sidebar (slide-in) */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <aside className="relative w-64 bg-base-200 border-r border-base-300 flex flex-col h-full">
            <div className="p-5 border-b border-base-300 flex justify-between items-center">
              <Link
                to="/"
                className="flex items-center gap-2.5"
                onClick={() => setIsOpen(false)}
              >
                <ShipWheelIcon className="size-9 text-primary" />
                <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                  CRYPHI
                </span>
              </Link>
              <button onClick={() => setIsOpen(false)}>
                <XIcon className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
                    currentPath === link.to ? "btn-active" : ""
                  }`}
                  onClick={() => setIsOpen(false)} // close after click
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-base-300 mt-auto">
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="w-10 rounded-full">
                    <img src={authUser?.profilePic} alt="User Avatar" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{authUser?.fullName}</p>
                  <p className="text-xs text-success flex items-center gap-1">
                    <span className="size-2 rounded-full bg-success inline-block" />
                    Online
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
