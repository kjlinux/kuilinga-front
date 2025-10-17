"use client";

import type React from "react";

import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  BarChart3,
  Settings,
  X,
  Building,
  Globe,
  Briefcase,
  HardDrive,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
  { path: "/attendance", icon: ClipboardList, label: "Présences" },
  { path: "/reports", icon: BarChart3, label: "Rapports" },
  { path: "/employees", icon: Users, label: "Employés" },
  { path: "/organizations", icon: Building, label: "Organisations" },
  { path: "/sites", icon: Globe, label: "Sites" },
  { path: "/departments", icon: Briefcase, label: "Départements" },
  { path: "/devices", icon: HardDrive, label: "Terminaux" },
  { path: "/leaves", icon: Calendar, label: "Congés" },
  { path: "/settings", icon: Settings, label: "Paramètres" },
];

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  collapsed,
  onToggleCollapse,
}) => {
  const location = useLocation();

  return (
    <>
      {/* Overlay pour mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 bg-white shadow-lg z-40 transform transition-all duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${collapsed ? "lg:w-20" : "lg:w-64"} w-64`}
      >
        {/* Bouton fermer pour mobile */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 lg:hidden z-10"
          aria-label="Fermer le menu"
        >
          <X className="w-5 h-5 text-secondary" />
        </button>

        {/* Bouton collapse pour desktop */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex absolute -right-3 top-8 w-6 h-6 bg-primary text-white rounded-full items-center justify-center hover:bg-accent transition-colors z-10 shadow-md"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        {/* Menu de navigation avec scroll */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2 mt-4 lg:mt-0 pb-20">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                title={collapsed ? item.label : ""}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-white shadow-md"
                    : "text-secondary hover:bg-gray-100"
                } ${collapsed ? "lg:justify-center lg:px-2" : ""}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span
                  className={`font-medium whitespace-nowrap ${
                    collapsed ? "lg:hidden" : ""
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer fixe */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
          <p
            className={`text-xs text-center text-accent transition-opacity ${
              collapsed ? "lg:opacity-0 lg:hidden" : ""
            }`}
          >
            KUILINGA v2.0
            <br />© 2025 TANGA GROUP
          </p>
          {collapsed && (
            <p className="hidden lg:block text-xs text-center text-accent font-bold">
              K
            </p>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
