"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  Crown,
  Calendar,
  DollarSign,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  ShoppingCart,
  Zap,
  Wallet,
  Loader2,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useContract } from "../contexts/ContractContext";
import { useAbstractPrivyLogin } from "@abstract-foundation/agw-react/privy";
import { formatEther } from "viem";

export default function SearchSection() {
  const [domainName, setDomainName] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedYears, setSelectedYears] = useState<number>(1);
  const [currentPrice, setCurrentPrice] = useState<bigint | null>(null);
  const [result, setResult] = useState<null | {
    type: "found" | "not-found";
    domain: string;
    tld: string;
    name: string;
    owner?: string;
    expiration?: string;
    price?: bigint;
    marketplaces?: { name: string; url: string; icon: string }[];
  }>(null);

  const {
    getRegisteredTLDs,
    resolveDomain,
    getDomainPrice,
    registerDomain,
    isConnected,
    address,
    isLoading,
    getNameServiceContract,
  } = useContract();
  const { login } = useAbstractPrivyLogin();

  // State for TLDs and validation
  const [availableTLDs, setAvailableTLDs] = useState<string[]>([]);
  const [isLoadingTLDs, setIsLoadingTLDs] = useState(true);
  const [validationError, setValidationError] = useState<string>("");

  // Load available TLDs on component mount
  useEffect(() => {
    const loadTLDs = async () => {
      try {
        setIsLoadingTLDs(true);
        const tlds = await getRegisteredTLDs();
        setAvailableTLDs(tlds);
      } catch (error) {
        console.error("Error loading TLDs:", error);
        setAvailableTLDs([]);
      } finally {
        setIsLoadingTLDs(false);
      }
    };

    loadTLDs();
  }, []);

  // Parse domain input
  const parsed = useMemo(() => {
    const input = domainName.trim().toLowerCase();
    if (!input) return { name: "", tld: "", isValid: false };

    if (input.includes(".")) {
      const parts = input.split(".");
      if (parts.length === 2) {
        const name = parts[0].replace(/[^a-zA-Z0-9]/g, "");
        const tld = parts[1];
        return { name, tld, isValid: name.length > 0 && tld.length > 0 };
      }
    }

    // If no TLD specified, assume first available TLD
    const name = input.replace(/[^a-zA-Z0-9]/g, "");
    const tld = availableTLDs.length > 0 ? availableTLDs[0] : "";
    return { name, tld, isValid: name.length > 0 && tld.length > 0 };
  }, [domainName, availableTLDs]);

  // Validation
  const validation = useMemo(() => {
    if (!parsed.isValid)
      return { isValid: false, error: "Invalid domain format" };

    const { name, tld } = parsed;

    if (!availableTLDs.includes(tld)) {
      return { isValid: false, error: `TLD "${tld}" is not supported` };
    }

    if (name.length < 3) {
      return { isValid: false, error: "Name must be at least 3 characters" };
    }

    if (name.length > 20) {
      return { isValid: false, error: "Name must be 20 characters or less" };
    }

    if (!/^[a-zA-Z0-9]+$/.test(name)) {
      return {
        isValid: false,
        error: "Name can only contain letters and numbers",
      };
    }

    if (name.startsWith(".") || name.endsWith(".")) {
      return {
        isValid: false,
        error: "Name cannot start or end with a &apos;.&apos;",
      };
    }

    return { isValid: true, error: "" };
  }, [parsed, availableTLDs]);

  // Update validation error
  useEffect(() => {
    setValidationError(validation.error);
  }, [validation.error]);

  // Update price when years change
  useEffect(() => {
    const updatePrice = async () => {
      if (result && result.type === "not-found") {
        try {
          const price = await getDomainPrice(
            result.name,
            result.tld,
            selectedYears
          );
          setCurrentPrice(price);
        } catch (error) {
          console.error("Error updating price:", error);
          setCurrentPrice(null);
        }
      }
    };

    updatePrice();
  }, [selectedYears, result, getDomainPrice]);

  const handleSearch = async () => {
    if (!validation.isValid) return;

    setIsSearching(true);
    setResult(null);
    setCurrentPrice(null);

    try {
      const { name, tld } = parsed;
      const domainInfo = await resolveDomain(name, tld);
      // const tldContractAddress = domainInfo?.nftAddress;
      // const tokenId = domainInfo?.tokenId;
      if (
        domainInfo &&
        domainInfo.owner !== "0x0000000000000000000000000000000000000000" &&
        Number(domainInfo.expiration) * 1000 > Date.now()
      ) {
        // Domain is taken
        const expirationDate = new Date(Number(domainInfo.expiration) * 1000);
        setResult({
          type: "found",
          domain: `${name}.${tld}`,
          tld,
          name,
          owner: domainInfo.owner,
          expiration: expirationDate.toLocaleDateString(),
          marketplaces: [
            { name: "OpenSea", url: "https://opensea.io", icon: "🦄" },
            { name: "Magic Eden", url: "https://magiceden.io", icon: "✨" },
            { name: "ZKMarket", url: "https://zkmarket.io", icon: "🔒" },
            { name: "Mintify", url: "https://mintify.xyz", icon: "🎨" },
          ],
        });
      } else {
        // Domain is available
        try {
          const price = await getDomainPrice(name, tld, 1);
          setResult({
            type: "not-found",
            domain: `${name}.${tld}`,
            tld,
            name,
            price,
          });
          setCurrentPrice(price);
        } catch (error) {
          console.error("Error getting domain price:", error);
          setResult({
            type: "not-found",
            domain: `${name}.${tld}`,
            tld,
            name,
          });
          setCurrentPrice(null);
        }
      }
    } catch (error) {
      console.error("Error searching domain:", error);
      setValidationError("Error searching domain. Please try again.");
    } finally {
      setIsSearching(false);
    }

    // Scroll to results
    const el = document.querySelector('[data-section="results"]');
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleConnectWallet = async () => {
    try {
      await login();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleRegister = async () => {
    if (!isConnected || !result || result.type !== "not-found" || isRegistering)
      return;

    setIsRegistering(true);
    try {
      await registerDomain(result.name, result.tld, selectedYears);
      // Refresh the search to show the domain is now taken
      await handleSearch();
    } catch (error) {
      console.error("Error registering domain:", error);
      setValidationError("Failed to register domain. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <section className="py-12 px-6 md:ml-96 md:mr-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Card */}
        <motion.div
          className="glass-card rounded-2xl p-12 text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Main Heading */}
          <motion.h1
            className="text-5xl md:text-7xl font-inter mb-6 text-foreground drop-shadow-lg transition-colors duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Your Web3 Name, HotDog-Style
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-inter mb-12 max-w-3xl mx-auto font-medium leading-relaxed transition-colors duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            On Abstract, everything&apos;s fast, cheap, and fun. Claim your
            hotdog name — one sizzling identity for all your wallets, dApps, and
            community flexing.
          </motion.p>

          {/* Available TLDs */}
          {!isLoadingTLDs && availableTLDs.length > 0 && (
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Available TLDs:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {availableTLDs.map((tld) => (
                  <span
                    key={tld}
                    className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium"
                  >
                    .{tld}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Search Section */}
          <motion.div
            className="relative max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <div className="relative">
              <Search
                className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10 transition-colors duration-300"
                size={24}
              />
              <input
                type="text"
                placeholder="Search for a name like sausage.hotdogs"
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
                className="relative w-full px-16 py-6 text-xl font-inter bg-background border-2 border-gray-200 dark:border-gray-600 rounded-3xl text-foreground placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-400 transition-all duration-300 shadow-lg"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Sparkles
                className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10 transition-colors duration-300"
                size={24}
              />
            </div>

            <motion.button
              className="abstract-green-gradient mt-6 px-12 py-4 text-xl font-inter text-white shadow-lg relative overflow-hidden rounded-2xl disabled:opacity-60"
              disabled={
                !domainName.trim() ||
                !validation.isValid ||
                isSearching ||
                isLoading
              }
              whileHover={{ scale: isSearching ? 1 : 1.05 }}
              whileTap={{ scale: isSearching ? 1 : 0.95 }}
              onClick={handleSearch}
            >
              {isSearching ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Searching…
                </>
              ) : (
                "Check Availability"
              )}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: [-250, 250] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </motion.button>

            {validationError && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                {validationError}
              </p>
            )}

            {!validationError && parsed.name && parsed.tld && (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                Searching:{" "}
                <span className="font-mono font-semibold">
                  {parsed.name}.{parsed.tld}
                </span>
              </p>
            )}
          </motion.div>
        </motion.div>

        {/* Results */}
        <div data-section="results" />
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={result.type}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              {result.type === "found" ? (
                <div className="glass-card p-8 rounded-2xl border border-white/10">
                  <div className="text-center mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3"
                    >
                      <AlertCircle className="text-red-500" size={32} />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-foreground mb-1">
                      Domain Already Taken
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-mono text-green-500">
                        {result.domain}
                      </span>{" "}
                      is already registered
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="p-6 border border-white/10 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Crown className="text-yellow-500" size={18} />
                        <h3 className="font-semibold text-foreground">Owner</h3>
                      </div>
                      <p className="font-mono text-sm text-gray-600 dark:text-gray-300 break-all">
                        {result.owner}
                      </p>
                    </div>

                    <div className="p-6 border border-white/10 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="text-blue-500" size={18} />
                        <h3 className="font-semibold text-foreground">
                          Expires
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        {result.expiration}
                      </p>
                    </div>

                    <div className="p-6 border border-white/10 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <ShoppingCart className="text-purple-500" size={18} />
                        <h3 className="font-semibold text-foreground">
                          Available On
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.marketplaces?.map((mkt, idx) => (
                          <motion.a
                            key={mkt.name}
                            href={mkt.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-300 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.2,
                              delay: 0.2 + idx * 0.05,
                            }}
                          >
                            <span>{mkt.icon}</span>
                            {mkt.name}
                            <ExternalLink size={12} />
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-card p-8 rounded-2xl border border-white/10">
                  <div className="text-center mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3"
                    >
                      <CheckCircle className="text-green-500" size={32} />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-foreground mb-1">
                      Domain Available!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-mono text-green-500">
                        {result.domain}
                      </span>{" "}
                      is ready to be claimed
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="p-6 border border-white/10 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <Calendar className="text-blue-500" size={18} />
                        <h3 className="font-semibold text-foreground">
                          Registration Period
                        </h3>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3, 5, 10].map((year) => (
                          <button
                            key={year}
                            onClick={() => setSelectedYears(year)}
                            className={`p-3 rounded-xl border-2 text-sm transition-all ${
                              selectedYears === year
                                ? "border-green-400 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                                : "border-gray-200 dark:border-gray-600 hover:border-green-400"
                            }`}
                          >
                            {year} {year === 1 ? "Year" : "Years"}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 border border-white/10 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <DollarSign className="text-green-500" size={18} />
                        <h3 className="font-semibold text-foreground">
                          Estimated Cost
                        </h3>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-500 mb-1">
                          {currentPrice ? formatEther(currentPrice) : "..."} ETH
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">
                          for {selectedYears}{" "}
                          {selectedYears === 1 ? "year" : "years"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    {!isConnected ? (
                      <motion.button
                        onClick={handleConnectWallet}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-10 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-105 shadow-lg inline-flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Wallet size={20} />
                        Connect Wallet to Register
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={handleRegister}
                        disabled={isRegistering}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-10 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-105 shadow-lg inline-flex items-center gap-2 disabled:opacity-60"
                        whileHover={{ scale: isRegistering ? 1 : 1.05 }}
                        whileTap={{ scale: isRegistering ? 1 : 0.95 }}
                      >
                        {isRegistering ? (
                          <>
                            <Loader2 className="animate-spin mr-2" size={20} />
                            Registering...
                          </>
                        ) : (
                          <>
                            <Zap size={20} />
                            Register {result.domain}
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
