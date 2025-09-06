"use client";

import { motion } from "framer-motion";
import {
  Clock,
  RefreshCw,
  Plus,
  ExternalLink,
  Send,
  Star,
  Wallet,
  RotateCcw,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useContract } from "../contexts/ContractContext";
import NFTSVGCreator from "./NFTSVGCreator";

interface DomainData {
  name: string;
  tld: string;
  expiration: bigint;
  isMain: boolean;
}

export default function ManagePage({
  changeToSearch,
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
    setMainDomain,
    isLoading,
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
              isMain: domainName === mainDomainName,
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

          {/* Quick Stats - Only Total and Expiring Soon */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 border border-gray-200 dark:border-gray-600 bg-green-50 dark:bg-green-900/20 rounded-xl hover:border-green-500 duration-300">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                {loading ? "..." : totalDomains}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Total Names
              </div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-green-500 duration-300">
              <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-400 mb-1">
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
          <div className="glass-card p-8 text-center">
            <Wallet size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Connect your wallet to view and manage your HotDog names
            </p>
            <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center gap-2 mx-auto">
              <Wallet size={20} />
              Connect Wallet
            </button>
          </div>
        )}

        {/* Owned Domains */}
        {isConnected && (
          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
                Your HotDog Names
              </h2>
              <button
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors duration-300"
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
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Loading domains...
                </p>
              </div>
            ) : domains.length === 0 ? (
              <div className="text-center py-8">
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
                    className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-500 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center relative group cursor-pointer"
                          onMouseEnter={() => setHoveredDomain(domain.name)}
                          onMouseLeave={() => setHoveredDomain(null)}
                        >
                          <NFTSVGCreator
                            name={domain.name.split(".")[0]}
                            tld={domain.tld}
                            className="w-8 h-8"
                          />
                          {/* Hover Preview */}
                          {hoveredDomain === domain.name && (
                            <div className="absolute -top-2 -left-2 z-50 pointer-events-none">
                              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-600 p-4 transform scale-150">
                                <NFTSVGCreator
                                  name={domain.name.split(".")[0]}
                                  tld={domain.tld}
                                  className="w-32 h-32"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold text-foreground font-mono">
                              {domain.name}
                            </h3>
                            {domain.isMain && (
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs font-semibold flex items-center gap-1">
                                <Star size={12} />
                                Main
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                isExpiringSoon(domain.expiration)
                                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
                                  : "bg-green-200 dark:bg-green-900/30 text-green-800 dark:text-green-200"
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

                      <div className="flex items-center gap-3">
                        <button
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all duration-300"
                          onClick={() => {
                            setRenewDomainName(domain.name);
                            setRenewPrice(calculateRenewPrice(domain.name, 1));
                            setShowRenewModal(true);
                          }}
                          title="Renew Domain"
                        >
                          <RotateCcw size={16} />
                        </button>
                        <button
                          className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300"
                          onClick={() => {
                            setTransferDomainName(domain.name);
                            setShowTransferModal(true);
                          }}
                          title="Transfer Domain"
                        >
                          <Send size={16} />
                        </button>
                        <button
                          className={`p-2 rounded-lg transition-all duration-300 ${
                            domain.isMain
                              ? "text-blue-500 bg-blue-50 dark:bg-blue-900/20 cursor-not-allowed"
                              : "text-gray-600 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
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
          <div className="fixed inset-0 bg-black/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-blue-900 dark:bg-blue-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300 mb-4">
                Transfer Domain
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Domain
                  </label>
                  <input
                    type="text"
                    value={transferDomainName}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    value={transferAddress}
                    onChange={(e) => setTransferAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-blue-50 dark:bg-blue-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowTransferModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTransfer}
                    disabled={!transferAddress}
                    className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
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
          <div className="fixed inset-0 bg-black/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-blue-50 dark:bg-blue-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300 mb-4">
                Renew Domain
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Domain
                  </label>
                  <input
                    type="text"
                    value={renewDomainName}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-blue-50 dark:bg-blue-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 10].map((year) => (
                      <option key={year} value={year}>
                        {year} {year === 1 ? "Year" : "Years"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
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
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRenew}
                    className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
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
