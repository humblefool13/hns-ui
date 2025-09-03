"use client";

import { motion } from "framer-motion";
import {
  Globe,
  Clock,
  Settings,
  RefreshCw,
  Plus,
  Trash2,
  ExternalLink,
  Lock,
  Unlock,
} from "lucide-react";

export default function ManagePage({
  changeToSearch,
}: {
  changeToSearch: () => void;
}) {
  const ownedDomains = [
    {
      id: 1,
      name: "vind.hotdog",
      status: "active",
      expiry: "2025-12-15",
      isLocked: true,
      lastUpdated: "2 hours ago",
    },
    {
      id: 2,
      name: "crypto.hotdog",
      status: "active",
      expiry: "2025-11-20",
      isLocked: false,
      lastUpdated: "1 day ago",
    },
    {
      id: 3,
      name: "nft.hotdog",
      status: "expiring",
      expiry: "2025-01-05",
      isLocked: true,
      lastUpdated: "3 days ago",
    },
  ];

  return (
    <div className="min-h-screen p-6 md:ml-96 md:mr-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Page Header */}
        <div className="glass-card p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Manage Your HotDog Names
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Control and configure your Web3 identity portfolio
              </p>
            </div>
            <button
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center gap-2"
              onClick={changeToSearch}
            >
              <Plus size={20} />
              Register New Name
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                3
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Total Names
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                2
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Active
              </div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                1
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Expiring Soon
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                2
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Locked
              </div>
            </div>
          </div>
        </div>

        {/* Owned Domains */}
        <div className="glass-card p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <Globe className="text-green-500" />
              Your HotDog Names
            </h2>
            <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors duration-300">
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          <div className="space-y-4">
            {ownedDomains.map((domain, index) => (
              <motion.div
                key={domain.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-500 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                      <Globe
                        className="text-green-600 dark:text-green-400"
                        size={24}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground font-mono">
                        {domain.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            domain.status === "active"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                              : domain.status === "expiring"
                              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
                              : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                          }`}
                        >
                          {domain.status === "active"
                            ? "Active"
                            : domain.status === "expiring"
                            ? "Expiring Soon"
                            : "Expired"}
                        </span>
                        <span>Expires: {domain.expiry}</span>
                        <span>Updated: {domain.lastUpdated}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      className={`p-2 rounded-lg transition-all duration-300 ${
                        domain.isLocked
                          ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                          : "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                      }`}
                    >
                      {domain.isLocked ? (
                        <Lock size={16} />
                      ) : (
                        <Unlock size={16} />
                      )}
                    </button>
                    <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-300">
                      <Settings size={16} />
                    </button>
                    <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300">
                      <ExternalLink size={16} />
                    </button>
                    <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
