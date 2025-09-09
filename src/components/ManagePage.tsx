"use client";

import { motion } from "framer-motion";
import { RefreshCw, Plus, Send, Star, Wallet, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { useContract } from "../contexts/ContractContext";
import NFTSVGCreator from "./NFTSVGCreator";
import { useLoginWithAbstract } from "@abstract-foundation/agw-react";

interface DomainData {
  name: string;
  tld: string;
  expiration: bigint;
  isMain: boolean;
}

export default function ManagePage({
  changeToSearch
}: {
  changeToSearch: () => void;
}) {
  const {
    isConnected,
    address,
    getAddressDomains,
    getMainDomain,
    getDomainExpiration,
    transferDomain,
    renewDomain,
    getDomainPrice,
    setMainDomain
  } = useContract();

  const [domains, setDomains] = useState<DomainData[]>([]);
  const [mainDomain, setMainDomainState] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [transferAddress, setTransferAddress] = useState("");
  const [transferDomainName, setTransferDomainName] = useState("");
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [renewDomainName, setRenewDomainName] = useState("");
  const [renewYears, setRenewYears] = useState(1);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewPrice, setRenewPrice] = useState(0);
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);
  const { login } = useLoginWithAbstract();
  const [width, setWidth] = useState(1024); // Default to desktop width for SSR

  // Handle window resize and set initial width
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // Set initial width on client side
    if (typeof window !== "undefined") {
      setWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  // Calculate stats
  const totalDomains = domains.length;
  const now = Date.now();
  const thirtyMonthsFromNow = now + 30 * 24 * 60 * 60 * 1000; // 1 month in milliseconds
  const expiringSoon = domains.filter((domain) => {
    const expirationTime = Number(domain.expiration) * 1000; // Convert from seconds to milliseconds
    return expirationTime < thirtyMonthsFromNow;
  }).length;

  const loadDomains = async () => {
    if (!isConnected || !address) return;

    setLoading(true);
    try {
      const domainNames = await getAddressDomains(address);
      const mainDomainName = await getMainDomain(address);

      const domainData: DomainData[] = [];

      for (const domainName of domainNames) {
        const [name, tld] = domainName.split(".");
        if (name && tld) {
          try {
            const expiration = await getDomainExpiration(name, tld);
            domainData.push({
              name: domainName,
              tld,
              expiration,
              isMain: domainName === mainDomainName
            });
          } catch (error) {
            console.error(`Error getting expiration for ${domainName}:`, error);
          }
        }
      }
      setDomains(domainData);
      setMainDomainState(mainDomainName);
    } catch (error) {
      console.error("Error loading domains:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      loadDomains();
    }
  }, [isConnected, address]);

  const handleTransfer = async () => {
    if (!transferAddress || !transferDomainName) return;

    try {
      const [name, tld] = transferDomainName.split(".");
      if (name && tld) {
        await transferDomain(name, tld, transferAddress as `0x${string}`);
        setShowTransferModal(false);
        setTransferAddress("");
        setTransferDomainName("");
        loadDomains();
      }
    } catch (error) {
      console.error("Error transferring domain:", error);
    }
  };

  const handleRenew = async () => {
    if (!renewDomainName) return;

    try {
      const [name, tld] = renewDomainName.split(".");
      if (name && tld) {
        await renewDomain(name, tld, renewYears);
        setShowRenewModal(false);
        setRenewDomainName("");
        setRenewYears(1);
        loadDomains();
      }
    } catch (error) {
      console.error("Error renewing domain:", error);
    }
  };

  const calculateRenewPrice = (domainName: string, years: number) => {
    const [name] = domainName.split(".");
    return getDomainPrice(name, years);
  };

  const handleSetMainDomain = async (domainName: string) => {
    try {
      await setMainDomain(domainName);
      setMainDomainState(domainName);
      loadDomains(); // Refresh the list to update the main domain status
    } catch (error) {
      console.error("Error setting main domain:", error);
    }
  };

  const formatExpirationDate = (expiration: bigint) => {
    const date = new Date(Number(expiration) * 1000);
    return date.toLocaleDateString();
  };

  const isExpiringSoon = (expiration: bigint) => {
    const expirationTime = Number(expiration) * 1000;
    const thirtyMonthsFromNow = Date.now() + 30 * 24 * 60 * 60 * 1000;
    return expirationTime < thirtyMonthsFromNow;
  };

  return (
    <div className="min-h-screen p-6 lg:mr-2 lg:ml-80 xl:mr-6 xl:ml-96">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-6xl space-y-6"
      >
        {/* Page Header */}
        <div className="hover:border-dim-green dark:hover:border-bright-green relative mt-4 rounded-2xl border border-gray-300 bg-gray-100 p-8 shadow-md backdrop-blur-xl transition-all duration-300 hover:bg-white hover:shadow-lg lg:mt-0 dark:border-gray-700/50 dark:bg-[#1e1e1e] dark:hover:bg-black">
          <div className="mb-6 flex flex-col items-center justify-between md:flex-row">
            <div className="xl:w-none lg:w-3/5">
              <h1 className="mb-2 text-2xl font-bold text-black xl:text-4xl dark:text-white">
                Manage Your HotDog Names
              </h1>
              <p className="text-md lg:text-md text-gray-600 xl:text-lg dark:text-gray-300">
                Control and configure your Web3 identity portfolio
              </p>
            </div>
            <button
              className="mt-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-green-600 hover:to-green-700 hover:shadow-lg md:mt-0"
              onClick={changeToSearch}
            >
              <Plus size={20} />
              Register Name
            </button>
          </div>

          {/* Quick Stats - Only Total and Expiring Soon */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-300 bg-green-100 p-4 text-center duration-300 hover:border-green-500 dark:border-gray-600 dark:bg-green-900/20">
              <div className="mb-1 text-2xl font-bold text-green-600 dark:text-green-400">
                {loading ? "..." : totalDomains}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Total Names
              </div>
            </div>
            <div className="rounded-xl border border-gray-300 bg-yellow-100 p-4 text-center duration-300 hover:border-green-500 dark:border-gray-600 dark:bg-yellow-900/20">
              <div className="mb-1 text-2xl font-bold text-yellow-800 dark:text-yellow-400">
                {loading ? "..." : expiringSoon}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Expiring Soon (30 days)
              </div>
            </div>
          </div>
        </div>

        {/* Connect Wallet Section */}
        {!isConnected && (
          <div className="hover:border-dim-green dark:hover:border-bright-green relative rounded-2xl border border-gray-300 bg-gray-100 p-8 text-center shadow-md backdrop-blur-xl transition-all duration-300 hover:bg-white hover:shadow-lg dark:border-gray-700/50 dark:bg-[#1e1e1e] dark:hover:bg-black">
            <Wallet size={64} className="mx-auto mb-4 text-gray-400" />
            <h2 className="mb-4 text-2xl font-bold text-black dark:text-white">
              Connect Your Wallet
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Connect your wallet to view and manage your HotDog names
            </p>
            <button
              className="mx-auto flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-green-600 hover:to-green-700 hover:shadow-lg"
              onClick={login}
            >
              <Wallet size={20} />
              Connect Wallet
            </button>
          </div>
        )}

        {/* Owned Domains */}
        {isConnected && (
          <div className="hover:border-dim-green dark:hover:border-bright-green relative rounded-2xl border border-gray-300 bg-gray-100 p-8 text-center shadow-md backdrop-blur-xl transition-all duration-300 hover:bg-white hover:shadow-lg dark:border-gray-700/50 dark:bg-[#1e1e1e] dark:hover:bg-black">
            <div className="mb-6 flex flex-col items-center justify-between md:flex-row">
              <h2 className="flex items-center gap-3 text-lg font-bold text-black md:text-2xl lg:text-xl xl:text-2xl dark:text-white">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-100 dark:bg-green-800">
                  <div className="h-4 w-4 rounded-full bg-green-500 dark:bg-green-400"></div>
                </div>
                Your HotDog Names
              </h2>
              <button
                className="mt-2 flex items-center gap-2 text-gray-600 transition-colors duration-300 hover:text-green-500 md:mt-0 dark:text-gray-400"
                onClick={loadDomains}
                disabled={loading}
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="py-8 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-green-500"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Loading domains...
                </p>
              </div>
            ) : domains.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  No domains found
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {domains.map((domain, index) => (
                  <motion.div
                    key={domain.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="rounded-xl border border-gray-200 p-6 transition-all duration-300 hover:border-green-500 dark:border-gray-700"
                  >
                    <div className="flex flex-col items-center justify-between md:flex-row">
                      <div className="flex flex-col items-center gap-4 md:flex-row">
                        <div
                          className="group relative flex h-36 w-36 cursor-pointer items-center justify-center rounded-xl bg-green-100 lg:h-12 lg:w-12 dark:bg-green-900/30"
                          onMouseEnter={() => setHoveredDomain(domain.name)}
                          onMouseLeave={() => setHoveredDomain(null)}
                        >
                          <NFTSVGCreator
                            name={domain.name.split(".")[0]}
                            tld={domain.tld}
                            className="h-full w-full"
                          />
                          {/* Hover Preview */}
                          {hoveredDomain === domain.name && width > 768 && (
                            <div className="pointer-events-none absolute -top-2 -left-2 z-50">
                              <div className="scale-150 transform rounded-lg border border-gray-200 bg-white p-4 shadow-2xl dark:border-gray-600 dark:bg-gray-800">
                                <NFTSVGCreator
                                  name={domain.name.split(".")[0]}
                                  tld={domain.tld}
                                  className="h-28 w-28"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex flex-col items-center lg:flex-row lg:gap-2">
                            <h3 className="font-mono text-xl font-bold text-black lg:text-base xl:text-xl dark:text-white">
                              {domain.name}
                            </h3>
                            {domain.isMain && (
                              <span className="flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                                <Star size={12} />
                                Main
                              </span>
                            )}
                          </div>
                          <div className="mt-4 flex flex-col items-center text-sm text-gray-600 md:mt-6 lg:mt-0 lg:flex-row lg:gap-4 dark:text-gray-400">
                            <span
                              className={`rounded-full px-2 py-1 text-xs ${
                                isExpiringSoon(domain.expiration)
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                                  : "bg-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                              }`}
                            >
                              {isExpiringSoon(domain.expiration)
                                ? "Expiring Soon"
                                : "Active"}
                            </span>
                            <span>
                              Expires: {formatExpirationDate(domain.expiration)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-3 lg:mt-0">
                        <button
                          className="rounded-lg p-2 text-gray-600 transition-all duration-300 hover:bg-green-50 hover:text-green-500 dark:text-gray-400 dark:hover:bg-green-900/20"
                          onClick={() => {
                            setRenewDomainName(domain.name);
                            setRenewPrice(
                              calculateRenewPrice(domain.name, renewYears)
                            );
                            setShowRenewModal(true);
                          }}
                          title="Renew Domain"
                        >
                          <RotateCcw size={16} />
                        </button>
                        <button
                          className="rounded-lg p-2 text-gray-600 transition-all duration-300 hover:bg-red-50 hover:text-red-500 dark:text-gray-400 dark:hover:bg-red-900/20"
                          onClick={() => {
                            setTransferDomainName(domain.name);
                            setShowTransferModal(true);
                          }}
                          title="Transfer Domain"
                        >
                          <Send size={16} />
                        </button>
                        <button
                          className={`rounded-lg p-2 transition-all duration-300 ${
                            domain.isMain
                              ? "cursor-not-allowed bg-blue-50 text-blue-500 dark:bg-blue-900/20"
                              : "text-gray-600 hover:bg-blue-50 hover:text-blue-500 dark:text-gray-400 dark:hover:bg-blue-900/20"
                          }`}
                          onClick={() =>
                            !domain.isMain && handleSetMainDomain(domain.name)
                          }
                          disabled={domain.isMain}
                          title={
                            domain.isMain
                              ? "Already main domain"
                              : "Set as main domain"
                          }
                        >
                          <Star
                            size={16}
                            fill={domain.isMain ? "currentColor" : "none"}
                          />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Transfer Modal */}
        {showTransferModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm dark:bg-black/50">
            <div className="mx-4 w-full max-w-md rounded-xl border border-gray-300 bg-gray-100 p-6 shadow-2xl dark:border-gray-700/50 dark:bg-[#1e1e1e]">
              <h3 className="mb-4 text-xl font-bold text-black dark:text-white">
                Transfer Domain
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Domain
                  </label>
                  <input
                    type="text"
                    value={transferDomainName}
                    disabled
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 dark:border-gray-600 dark:bg-black dark:text-gray-400"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    value={transferAddress}
                    onChange={(e) => setTransferAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-black dark:text-white dark:placeholder-gray-400"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowTransferModal(false)}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTransfer}
                    disabled={!transferAddress}
                    className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 disabled:bg-gray-400"
                  >
                    Transfer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Renew Modal */}
        {showRenewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm dark:bg-black/50">
            <div className="mx-4 w-full max-w-md rounded-xl border border-gray-300 bg-gray-100 p-6 shadow-2xl dark:border-gray-700/50 dark:bg-[#1e1e1e]">
              <h3 className="mb-4 text-xl font-bold text-black dark:text-white">
                Renew Domain
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Domain
                  </label>
                  <input
                    type="text"
                    value={renewDomainName}
                    disabled
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500 dark:border-gray-600 dark:bg-black dark:text-gray-400"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Years to Renews
                  </label>
                  <select
                    value={renewYears}
                    onChange={(e) => {
                      const years = parseInt(e.target.value);
                      setRenewYears(years);
                      setRenewPrice(
                        calculateRenewPrice(renewDomainName, years)
                      );
                    }}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-black dark:text-white"
                  >
                    {[1, 2, 3, 4, 5, 10].map((year) => (
                      <option key={year} value={year}>
                        {year} {year === 1 ? "Year" : "Years"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-black">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Total Cost:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {renewPrice.toFixed(4)} ETH
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRenewModal(false)}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRenew}
                    className="flex-1 rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
                  >
                    Renew Domain
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
