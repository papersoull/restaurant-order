"use client";

import React, { useState } from "react";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
}

// const navItems: SidebarItem[] = [
//   {
//     label: "Dashboard",
//     href: "/admin",
//     icon: (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//       </svg>
//     ),
//   },
//   {
//     label: "Chef",
//     href: "/chef",
//     icon: (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
//       </svg>
//     ),
//   },
//   {
//     label: "Waiter",
//     href: "/waiter",
//     icon: (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
//       </svg>
//     ),
//   },
//   {
//     label: "Billing",
//     href: "/billing",
//     icon: (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
//       </svg>
//     ),
//   },
//   {
//     label: "Admin",
//     href: "/admin",
//     icon: (
//       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//       </svg>
//     ),
//   },
// ];

const adminNavItems: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: "Activity",
    href: "/admin/activity",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-6m3 6V7m3 10v-4m5 8H4a1 1 0 01-1-1V4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1z"/>
      </svg>
    ),
  },
];

const chefNavItems: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/chef",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
      </svg>
    ),
  },
];

const waiterNavItems: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/waiter",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
      </svg>
    ),
  },
  {
    label: "History",
    href: "/waiter/history",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3M12 3a9 9 0 100 18 9 9 0 000-18z"/>
      </svg>
    ),
  },
];

const billingNavItems: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/billing",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"/>
      </svg>
    ),
  },
];

const getNavItems = (currentPath: string): SidebarItem[] => {
  if (currentPath.startsWith("/admin")) return adminNavItems;
  if (currentPath.startsWith("/chef")) return chefNavItems;
  if (currentPath.startsWith("/waiter")) return waiterNavItems;
  if (currentPath.startsWith("/billing")) return billingNavItems;
  return [];
};

const bottomItems: SidebarItem[] = [
  {
    label: "Settings",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: "Logout",
    href: "#",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    ),
  },
];

interface SidebarProps {
  currentPath: string;
}

export function Sidebar({ currentPath }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return currentPath === "/admin";
    return currentPath.startsWith(href);
  };

  const navItems = getNavItems(currentPath);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-sidebar border-r border-default z-50 flex flex-col transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-5 h-[72px] border-b border-default ${collapsed ? "justify-center px-0" : ""}`}>
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-white text-lg font-bold">CT</span>
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-semibold text-primary-text">Cinnamon Table</p>
            <p className="text-[11px] text-secondary-text">Restaurant OS</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                active
                  ? "bg-primary-light text-primary-color font-medium"
                  : "text-secondary-text hover:bg-gray-50 hover:text-primary-text"
              } ${collapsed ? "justify-center px-0" : ""}`}
            >
              <span className={`flex-shrink-0 ${active ? "text-primary-color" : "text-secondary-text group-hover:text-primary-text"}`}>
                {item.icon}
              </span>
              {!collapsed && (
                <span className="text-sm">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className="ml-auto bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </a>
          );
        })}
      </nav>

      {/* Bottom items */}
      <div className="px-3 py-4 border-t border-default space-y-1">
        {bottomItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-secondary-text hover:bg-gray-50 hover:text-primary-text ${
              collapsed ? "justify-center px-0" : ""
            }`}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </a>
        ))}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200 text-secondary-text hover:bg-gray-50 hover:text-primary-text mt-2 ${
            collapsed ? "justify-center px-0" : ""
          }`}
        >
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          {!collapsed && <span className="text-sm">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}