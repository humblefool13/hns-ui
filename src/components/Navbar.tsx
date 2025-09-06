"use client";

import { motion } from "framer-motion";
import {
  Menu,
  Search,
  X,
  Sun,
  Moon,
  Grid,
  Twitter,
  MessageCircle,
  Send,
  Sailboat,
  Plus,
  Wallet,
  Globe,
  LogOut,
  BookOpen,
  FileText,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeProvider";
import { useState, useEffect } from "react";
import { useLoginWithAbstract } from "@abstract-foundation/agw-react";
import Image from "next/image";
import { useContract } from "@/contexts/ContractContext";

type PageType = "search" | "manage" | "activity" | "guide" | "docs";

interface NavbarProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
}

export default function Navbar({ currentPage, setCurrentPage }: NavbarProps) {
  const { theme, toggleTheme, mounted } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    getMainDomain,
    getAddressDomains,
    resolveDomain,
    address,
    isConnected,
    hnsManagerContract,
  } = useContract();
  const { login, logout } = useLoginWithAbstract();

  // State for blockchain data
  const [mainDomain, setMainDomain] = useState<string | null>(null);
  const [totalOwned, setTotalOwned] = useState<number>(0);
  const [expiringSoon, setExpiringSoon] = useState<number>(0);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Fetch blockchain data when connected
  useEffect(() => {
    const fetchBlockchainData = async () => {
      if (!isConnected || !address || !hnsManagerContract) return;

      setIsLoadingData(true);
      try {
        try {
          const main = await getMainDomain(address);
          if (main && main.trim() !== "") {
            setMainDomain(main);
          } else {
            setMainDomain(null);
          }
        } catch (error) {
          console.log("No main domain found");
          setMainDomain(null);
        }

        // Get all domains for the address
        try {
          const domains = await getAddressDomains(address);
          setTotalOwned(domains.length);

          // Check which domains are expiring within 1 month
          let expiringCount = 0;
          const oneMonthFromNow = BigInt(
            Math.floor(Date.now() / 1000) + 31 * 24 * 60 * 60
          ); // 30 days in seconds

          for (const domain of domains) {
            try {
              // Extract TLD from domain (assuming format: name.tld)
              const parts = domain.split(".");
              if (parts.length === 2) {
                const [name, tld] = parts;
                const domainInfo = await resolveDomain(name, tld);
                if (domainInfo && domainInfo.expiration < oneMonthFromNow) {
                  expiringCount++;
                }
              }
            } catch (error) {
              console.log(
                `Error checking expiration for domain ${domain}:`,
                error
              );
            }
          }

          setExpiringSoon(expiringCount);
        } catch (error) {
          console.log("Error fetching address domains:", error);
          setTotalOwned(0);
          setExpiringSoon(0);
        }
      } catch (error) {
        console.error("Error fetching blockchain data:", error);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchBlockchainData();
  }, [isConnected, address, hnsManagerContract]);

  // Don't render theme-dependent content until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="fixed top-6 left-6 h-[calc(100vh-48px)] w-72 bg-white rounded-3xl shadow-2xl border border-gray-200 z-40">
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1 mr-4">
              <div className="w-full h-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
          <div className="flex-1 bg-gray-200 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        className={`fixed top-4 left-4 z-50 md:hidden p-3 rounded-xl transition-all duration-200 border shadow-lg ${
          theme === "dark"
            ? "text-gray-300 hover:text-gray-100 bg-gray-800 hover:bg-gray-700 border-gray-600"
            : "text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border-gray-200"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* Floating Sidebar Navigation */}
      <motion.nav
        className={`fixed top-6 left-6 h-[calc(100vh-48px)] w-72 rounded-3xl shadow-2xl z-40 transform transition-all duration-300 ease-in-out ${
          theme === "dark" ? "border-gray-700" : "bg-white border-gray-200"
        } border ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
        initial={{ x: 0 }}
        animate={{ x: isMobileMenuOpen ? 0 : 8 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo Container */}
          <div className="flex items-center justify-between mb-6">
            <motion.div
              className="flex-1 mr-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Image
                src="/512x512_Logo.png"
                alt="ABSTRACT HOTDOGS"
                width={200}
                height={60}
                className="w-full h-auto object-contain"
                priority
              />
            </motion.div>

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all duration-200 flex-shrink-0 ${
                theme === "dark"
                  ? "text-gray-300 hover:text-gray-100 bg-gray-800 hover:bg-gray-700"
                  : "text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === "dark" ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                {theme === "dark" ? (
                  <Sun size={16} className="text-yellow-500" />
                ) : (
                  <Moon size={16} className="text-blue-500" />
                )}
              </motion.div>
            </motion.button>
          </div>

          {/* Name Service Summary Card */}
          <motion.div
            className="glass-card rounded-2xl p-4 mb-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {isConnected && address ? (
              // Connected State - Show Name Summary
              <div className="text-foreground transition-colors duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Globe size={16} className="text-green-600" />
                    <span className="text-sm font-inter font-medium">
                      My Names
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        theme === "dark" ? "bg-green-900" : "bg-green-100"
                      }`}
                    >
                      <span
                        className={`text-xs ${
                          theme === "dark" ? "text-green-400" : "text-green-600"
                        }`}
                      >
                        <svg
                          viewBox="0 0 24 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          height="18"
                        >
                          <path
                            d="M15.821 14.984L20.642 19.759L18.38 21.999L13.56 17.225C13.146 16.815 12.602 16.592 12.015 16.592C11.429 16.592 10.884 16.815 10.471 17.225L5.651 21.999L3.389 19.759L8.209 14.984H15.818H15.821Z"
                            fill="currentColor"
                          ></path>
                          <path
                            d="M16.626 13.608L23.209 15.353L24.036 12.29L17.453 10.545C16.889 10.396 16.42 10.038 16.127 9.536C15.834 9.037 15.758 8.453 15.909 7.895L17.671 1.374L14.579 0.556L12.816 7.076L16.623 13.604L16.626 13.608Z"
                            fill="currentColor"
                          ></path>
                          <path
                            d="M7.409 13.608L0.827 15.353L0 12.29L6.583 10.545C7.146 10.396 7.616 10.038 7.909 9.536C8.202 9.037 8.277 8.453 8.127 7.895L6.365 1.374L9.457 0.556L11.219 7.076L7.413 13.604L7.409 13.608Z"
                            fill="currentColor"
                          ></path>
                        </svg>
                      </span>
                    </div>
                    <button
                      onClick={logout}
                      className={`p-1 transition-colors ${
                        theme === "dark"
                          ? "text-gray-400 hover:text-gray-200"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      title="Disconnect Wallet"
                    >
                      <LogOut size={14} />
                    </button>
                  </div>
                </div>

                {/* Main Domain or Wallet Address */}
                <div
                  className={`mb-3 p-2 rounded-lg border transition-colors duration-300 ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-600"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <p
                    className={`text-xs font-inter mb-1 transition-colors duration-300 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {mainDomain ? "Main Domain" : "Wallet Address"}
                  </p>
                  <p
                    className={`text-xs font-inter font-mono break-all transition-colors duration-300 ${
                      theme === "dark" ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    {isLoadingData ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : mainDomain ? (
                      mainDomain
                    ) : (
                      `${address.slice(0, 6)}...${address.slice(-4)}`
                    )}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-sm font-inter transition-colors duration-300 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Total Owned:
                    </span>
                    <span className="text-lg font-inter font-bold text-foreground transition-colors duration-300">
                      {isLoadingData ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        totalOwned
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-sm font-inter transition-colors duration-300 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Expiring Soon:
                    </span>
                    <span
                      className={`text-sm font-inter font-medium transition-colors duration-300 ${
                        theme === "dark" ? "text-orange-400" : "text-orange-600"
                      }`}
                    >
                      {isLoadingData ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        expiringSoon
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              // Not Connected State - Show Connect Wallet
              <div className="text-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors duration-300 ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  <Wallet
                    size={24}
                    className={`transition-colors duration-300 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                </div>
                <h3
                  className={`text-sm font-inter mb-2 transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Connect Your Wallet
                </h3>
                <p
                  className={`text-xs font-inter mb-3 transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Start managing your hotdog names
                </p>
                <motion.button
                  onClick={login}
                  className="abstract-green-gradient w-full py-2 px-4 text-white text-sm font-inter font-medium rounded-xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: status === "connecting" ? 1 : 1.02 }}
                  whileTap={{ scale: status === "connecting" ? 1 : 0.98 }}
                >
                  {status === "connecting" ? "Connecting..." : "Connect Wallet"}
                </motion.button>
                {status === "connecting" && (
                  <p
                    className={`text-xs mt-2 transition-colors duration-300 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Please complete the connection in your wallet
                  </p>
                )}
              </div>
            )}
          </motion.div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-2">
            {[
              { id: "search", icon: Search, label: "Search" },
              { id: "manage", icon: Grid, label: "Manage" },
              { id: "activity", icon: Globe, label: "Activity" },
              { id: "guide", icon: BookOpen, label: "Guide" },
              { id: "docs", icon: FileText, label: "Docs" },
            ].map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setCurrentPage(item.id as PageType)}
                className={`navbar-link flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group w-full text-left ${
                  currentPage === item.id ? "active" : ""
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <div
                  className={`navbar-icon w-6 h-6 flex items-center justify-center transition-colors`}
                >
                  <item.icon
                    size={16}
                    className={`${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  />
                </div>
                <span
                  className={`font-inter font-medium navbar-link-content transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {item.label}
                </span>
              </motion.button>
            ))}
          </nav>

          {/* Social Links */}
          <div
            className={`pt-6 border-t transition-colors duration-300 ${
              theme === "dark" ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div className="flex justify-center space-x-3">
              <motion.a
                href="https://twitter.com/AbstractHotDogs"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Twitter
                  size={18}
                  className={`transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                />
              </motion.a>
              <motion.a
                href="https://discord.gg/abstracthotdogs"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <MessageCircle
                  size={18}
                  className={`transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                />
              </motion.a>
              <motion.a
                href="#"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Send
                  size={18}
                  className={`transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                />
              </motion.a>
              <motion.a
                href="#"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Sailboat
                  size={18}
                  className={`transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                />
              </motion.a>
              <motion.a
                href="#"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  theme === "dark"
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Plus
                  size={18}
                  className={`transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                />
              </motion.a>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
