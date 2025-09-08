"use client";

import { motion } from "framer-motion";
import {
  Menu,
  Search,
  X,
  Sun,
  Moon,
  Grid,
  Wallet,
  Globe,
  LogOut,
  BookOpen,
  FileText
} from "lucide-react";
import { useTheme } from "../contexts/ThemeProvider";
import { useState, useEffect } from "react";
import { useLoginWithAbstract } from "@abstract-foundation/agw-react";
import Image from "next/image";
import { useContract } from "@/contexts/ContractContext";

import Discord from "@/assets/discord.svg";
import Telegram from "@/assets/telegram.svg";
import OpenSea from "@/assets/opensea.svg";
import MagicEden from "@/assets/magicEden.svg";
import Twitter from "@/assets/twitter.svg";

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
    hnsManagerContract
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
      <div className="fixed top-6 left-6 z-40 h-[calc(100vh-48px)] w-72 rounded-3xl border border-gray-200 bg-white shadow-2xl">
        <div className="flex h-full flex-col p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="mr-4 flex-1">
              <div className="h-12 w-full animate-pulse rounded bg-gray-200"></div>
            </div>
            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200"></div>
          </div>
          <div className="flex-1 animate-pulse rounded-2xl bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        className="fixed top-4 left-4 z-50 rounded-xl border border-gray-200 bg-white p-3 text-gray-700 shadow-lg transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 md:hidden dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* Floating Sidebar Navigation */}
      <motion.nav
        className={`fixed top-6 z-40 h-[calc(100vh-48px)] w-80 transform rounded-3xl border border-gray-300 bg-gray-100 shadow-xl/30 shadow-black transition-all duration-300 ease-in-out md:left-6 md:w-72 dark:border-gray-600 dark:bg-[#1e1e1e] dark:shadow-white ${
          isMobileMenuOpen
            ? "left-5 translate-x-0"
            : "left-[-12px] -translate-x-full md:translate-x-0"
        }`}
        initial={{ x: -50 }}
        animate={{ x: isMobileMenuOpen ? 0 : 8 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex h-full flex-col p-6">
          {/* Logo Container */}
          <div className="mb-6 flex items-center justify-between">
            <motion.div
              className="mr-4 flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Image
                src="/512x512_Logo.png"
                alt="ABSTRACT HOTDOGS"
                width={200}
                height={60}
                className="h-auto w-full object-contain"
                priority
              />
            </motion.div>

            {/* Theme Toggle */}
            <motion.button
              onClick={() => {
                toggleTheme();
                setIsMobileMenuOpen(false);
              }}
              className="flex-shrink-0 rounded-full bg-gray-200 p-2 transition-all duration-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === "dark" ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                {theme === "dark" ? (
                  <Sun
                    size={16}
                    className="text-yellow-500 hover:text-yellow-400"
                  />
                ) : (
                  <Moon
                    size={16}
                    className="text-blue-500 hover:text-blue-600"
                  />
                )}
              </motion.div>
            </motion.button>
          </div>
          {/* Name Service Summary Card */}
          <motion.div
            className="mb-6 rounded-2xl border border-gray-300 bg-gray-200 p-4 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {isConnected && address ? (
              // Connected State - Show Name Summary
              <div className="transition-colors duration-300">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe size={16} className="text-green-600" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      My Names
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-800">
                      <span className="text-xs text-green-500 dark:text-green-400">
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
                      className="p-1 text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      title="Disconnect Wallet"
                    >
                      <LogOut size={14} />
                    </button>
                  </div>
                </div>

                {/* Main Domain or Wallet Address */}
                <div className="mb-3 rounded-lg border border-gray-300 bg-white p-2 transition-colors duration-300 dark:border-gray-600 dark:bg-black">
                  <p className="mb-1 text-xs text-gray-500 transition-colors duration-300 dark:text-gray-300">
                    {mainDomain ? "Main Domain" : "Wallet Address"}
                  </p>
                  <p className="font-mono text-xs break-all text-gray-700 transition-colors duration-300 dark:text-gray-200">
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
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 transition-colors duration-300 dark:text-gray-300">
                      Total Owned:
                    </span>
                    <span className="text-lg font-bold text-gray-700 transition-colors duration-300 dark:text-gray-200">
                      {isLoadingData ? (
                        <span className="animate-pulse">...</span>
                      ) : (
                        totalOwned
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 transition-colors duration-300 dark:text-gray-300">
                      Expiring Soon:
                    </span>
                    <span
                      className={`text-sm font-medium transition-colors duration-300 ${
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
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 transition-colors duration-300 dark:bg-gray-900">
                  <Wallet
                    size={24}
                    className="text-gray-500 transition-colors duration-300 dark:text-gray-400"
                  />
                </div>
                <h3 className="mb-2 text-sm text-gray-700 transition-colors duration-300 dark:text-gray-200">
                  Connect Your Wallet
                </h3>
                <p className="mb-3 text-xs text-gray-500 transition-colors duration-300 dark:text-gray-400">
                  Start managing your hotdog names
                </p>
                <motion.button
                  onClick={login}
                  className="w-full rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 text-sm font-medium text-white shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Connect Wallet
                </motion.button>
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
              { id: "docs", icon: FileText, label: "Docs" }
            ].map((item) => (
              <motion.button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id as PageType);
                  setIsMobileMenuOpen(false);
                }}
                className={`group flex w-full items-center space-x-3 rounded-xl p-3 text-left transition-all duration-300 hover:bg-gray-300 dark:hover:bg-gray-600 ${
                  currentPage === item.id
                    ? "border-dim-green border bg-green-300/20 dark:bg-green-600/20"
                    : ""
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex h-6 w-6 items-center justify-center transition-colors">
                  <item.icon
                    size={16}
                    className="text-gray-600 transition-colors duration-300 dark:text-gray-300"
                  />
                </div>
                <span className="navbar-link-content font-medium text-gray-700 transition-colors duration-300 dark:text-gray-200">
                  {item.label}
                </span>
              </motion.button>
            ))}
          </nav>
          {/* Social Links */}

          <div className="border-t border-gray-400 pt-6 transition-colors duration-300 dark:border-gray-500">
            <div className="flex justify-center space-x-3">
              {[
                {
                  name: "x",
                  icon: Twitter,
                  link: "https://x.com/AbstractHotDogs"
                },
                {
                  name: "discord",
                  icon: Discord,
                  link: "https://discord.gg/abstracthotdogs"
                },
                {
                  name: "telegram",
                  icon: Telegram,
                  link: "https://t.me/AbstractHotDogs"
                },
                {
                  name: "opensea",
                  icon: OpenSea,
                  link: "https://opensea.io/collection/abstract-hotdogs-abstract"
                },
                {
                  name: "magiceden",
                  icon: MagicEden,
                  link: "https://magiceden.io/collections/abstract/Abstract%20Hotdogs"
                }
              ].map((item) => (
                <motion.a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 p-2 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  key={item.name}
                >
                  <Image
                    src={item.icon}
                    alt={item.name}
                    className="dark:invert"
                  />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <motion.div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
