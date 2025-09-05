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
import { useLoginWithAbstract } from "@abstract-foundation/agw-react";
import NFTSVGCreator from "./NFTSVGCreator";

export default function SearchSection() {
  const [domainName, setDomainName] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedYears, setSelectedYears] = useState<number>(1);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [result, setResult] = useState<null | {
    type: "found" | "not-found";
    domain: string;
    tld: string;
    name: string;
    owner?: string;
    expiration?: string;
    nftAddress?: string;
    tokenId?: string;
    price?: number;
    marketplaces?: { name: string; url: string; icon: string }[];
  }>(null);

  const {
    getRegisteredTLDs,
    resolveDomain,
    getDomainPrice,
    registerDomain,
    isConnected,
    isLoading,
  } = useContract();
  const { login } = useLoginWithAbstract();

  // State for TLDs and validation
  const [availableTLDs, setAvailableTLDs] = useState<string[]>([]);
  const [isLoadingTLDs, setIsLoadingTLDs] = useState(true);
  const [validationError, setValidationError] = useState<string>("");
  const [hasAttemptedSearch, setHasAttemptedSearch] = useState(false);
  const [tx, setTx] = useState<string | null>(null);
  const explorerTxUrl = tx ? `https://sepolia.abscan.org/tx/${tx}` : null;
  const shortTx = tx ? `${tx.slice(0, 10)}…${tx.slice(-6)}` : null;

  // Load available TLDs on component mount (works even if not connected via fallback client)
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

    if (!isLoading && availableTLDs.length === 0) {
      loadTLDs();
    }
  }, [isLoading, getRegisteredTLDs]);

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
          const price = getDomainPrice(result.name, selectedYears);
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
    setHasAttemptedSearch(true);

    if (!validation.isValid) return;

    setIsSearching(true);
    setResult(null);
    setCurrentPrice(null);

    try {
      const { name, tld } = parsed;
      const domainInfo = await resolveDomain(name, tld);
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
          nftAddress: domainInfo.nftAddress,
          tokenId: domainInfo.tokenId.toString(),
          marketplaces: [
            {
              name: "OpenSea",
              url: `https://opensea.io/item/abstract/${domainInfo.nftAddress}/${domainInfo.tokenId}`,
              icon: "🦄",
            },
            {
              name: "Magic Eden",
              url: `https://magiceden.io/item-details/abstract/${domainInfo.nftAddress}/${domainInfo.tokenId}`,
              icon: "✨",
            },
            {
              name: "ZKMarket",
              url: `https://www.zkmarkets.com/abstract/collections/${domainInfo.nftAddress}/nfts/${domainInfo.tokenId}`,
              icon: "🔒",
            },
            {
              name: "Mintify",
              url: `https://app.mintify.com/nft/abstract/${domainInfo.nftAddress}/${domainInfo.tokenId}`,
              icon: "🎨",
            },
          ],
        });
      } else {
        // Domain is available
        try {
          const price = getDomainPrice(name, 1);
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

  const handleRegister = async () => {
    if (!isConnected || !result || result.type !== "not-found" || isRegistering)
      return;

    setIsRegistering(true);
    try {
      const tx = await registerDomain(result.name, result.tld, selectedYears);
      setTx(tx);
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
          className="glass-card rounded-2xl p-12 text-center my-18 relative"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="absolute top-6 right-6 group cursor-pointer z-20"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 rounded-full blur-sm opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 rounded-full animate-pulse"></div>
              </div>
              <div className="relative bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 rounded-full p-4 shadow-2xl border-2 border-yellow-300 group-hover:border-yellow-200 transition-all duration-300">
                <div className="text-white text-2xl mb-1 group-hover:scale-110 transition-transform duration-300">
                  👑
                </div>
                <div className="text-white text-xs font-bold tracking-wider group-hover:scale-105 transition-transform duration-300">
                  XP REWARDS
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/90 dark:to-amber-900/90 border-2 border-yellow-300 dark:border-yellow-600 rounded-2xl p-3 shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none">
                <div className="text-center">
                  <div className="text-yellow-200 dark:text-yellow-200 font-bold text-sm mb-2 flex items-center justify-center gap-1">
                    <span>👑</span>
                    <span>HotDogs NFT XP</span>
                    <span>👑</span>
                  </div>
                  <div className="text-yellow-700 dark:text-yellow-300 text-xs space-y-1">
                    <p className="font-semibold">Abstract Portal:</p>
                    <p>• Earn XP for holding NFTs</p>
                    <p className="font-semibold mt-2">HotDogs Portal:</p>
                    <p>• 10 points per NFT</p>
                    <p>• Bonus from badges</p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1 italic">
                      Level up with badges!
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-b-6 border-l-transparent border-r-transparent border-b-yellow-300 dark:border-b-yellow-600"></div>
              </div>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="text-5xl md:text-7xl font-inter pb-10 animated-gradient-text-wave drop-shadow-lg transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            Your Web3 Name
            <br />
            HotDog-Style
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
                    className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium hover:animated-gradient-text-fast transition-all duration-300 hover:scale-105"
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
                onChange={(e) => {
                  setDomainName(e.target.value);
                  setHasAttemptedSearch(false);
                }}
                className="relative w-full px-16 py-6 text-xl font-inter bg-background border-2 border-gray-200 dark:border-gray-600 rounded-3xl text-foreground placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-400 transition-all duration-300 shadow-lg"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Sparkles
                className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10 transition-colors duration-300"
                size={24}
              />
            </div>

            <motion.button
              className="abstract-green-gradient mt-6 px-12 py-4 text-xl font-inter text-white shadow-lg relative overflow-hidden rounded-2xl disabled:opacity-60 inline-flex items-center justify-center gap-2 whitespace-nowrap"
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

            {validationError && hasAttemptedSearch && (
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
                <div className="glass-card p-8 rounded-2xl border border-black/10 dark:border-white/10">
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

                  {/* NFT Preview */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex justify-center mb-6"
                  >
                    <div className="relative group">
                      <NFTSVGCreator
                        name={result.name}
                        tld={result.tld}
                        className="w-48 h-48 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-600 transition-all duration-300 group-hover:shadow-red-500/50 group-hover:shadow-3xl group-hover:scale-105 group-hover:border-red-300 dark:group-hover:border-red-400"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                      {/* Red Glow Effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-400/0 via-red-500/0 to-red-400/0 group-hover:from-red-400/20 group-hover:via-red-500/30 group-hover:to-red-400/20 transition-all duration-500 pointer-events-none" />

                      {/* Pulsing Ring Effect */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-red-400/50 group-hover:animate-pulse transition-all duration-300 pointer-events-none" />
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="p-6 border border-gray-200 dark:border-white/10 rounded-xl hover:border-green-500 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <Crown className="text-yellow-500" size={18} />
                        <h3 className="font-semibold text-foreground">Owner</h3>
                      </div>
                      <p className="font-mono text-sm text-gray-600 dark:text-gray-300 break-all">
                        {result.owner}
                      </p>
                    </div>

                    <div className="p-6 border border-gray-200 dark:border-white/10 rounded-xl hover:border-green-500 transition-all duration-300">
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

                    <div className="p-6 border border-gray-200 dark:border-white/10 rounded-xl hover:border-green-500 transition-all duration-300">
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
                    <div className="p-6 border border-gray-200 dark:border-white/10 rounded-xl hover:border-green-500 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-2">
                        <ExternalLink className="text-green-500" size={18} />
                        <h3 className="font-semibold text-foreground">
                          Explorer
                        </h3>
                      </div>
                      <div className="flex flex-col gap-3">
                        <motion.a
                          href={`https://sepolia.abscan.org/nft/${result.nftAddress}/${result.tokenId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-300 transition-all duration-300 w-fit"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View on Abscan
                          <ExternalLink size={12} />
                        </motion.a>
                        {result.nftAddress && result.tokenId && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 break-all">
                            {result.nftAddress} / {result.tokenId}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="glass-card p-8 rounded-2xl border border-black/10 dark:border-white/10">
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

                  {/* NFT Preview */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex justify-center mb-6"
                  >
                    <div className="relative group">
                      <NFTSVGCreator
                        name={result.name}
                        tld={result.tld}
                        className="w-48 h-48 rounded-2xl shadow-2xl border-2 border-green-400 dark:border-green-500 transition-all duration-300 group-hover:shadow-green-500/50 group-hover:shadow-3xl group-hover:scale-105 group-hover:border-green-300 dark:group-hover:border-green-400"
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                      {/* Green Glow Effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400/0 via-green-500/0 to-green-400/0 group-hover:from-green-400/20 group-hover:via-green-500/30 group-hover:to-green-400/20 transition-all duration-500 pointer-events-none" />

                      {/* Pulsing Ring Effect */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-green-400/50 group-hover:animate-pulse transition-all duration-300 pointer-events-none" />
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="p-6 border border-gray-200 dark:border-white/10 rounded-xl hover:border-green-500 transition-all duration-300">
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
                            className={`p-3 rounded-xl border-2 text-sm transition-all hover:border-green-500 duration-300 ${
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

                    <div className="p-6 border border-gray-200 dark:border-white/10 rounded-xl hover:border-green-500 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <DollarSign className="text-green-500" size={18} />
                        <h3 className="font-semibold text-foreground">
                          Estimated Cost
                        </h3>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-500 mb-1">
                          {currentPrice ? currentPrice : "..."} ETH
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
                        onClick={login}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-10 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-105 shadow-lg inline-flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Wallet size={20} />
                        Connect Wallet to Register
                      </motion.button>
                    ) : (
                      <>
                        {!tx ? (
                          <motion.button
                            onClick={handleRegister}
                            disabled={isRegistering}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-10 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-105 shadow-lg inline-flex items-center gap-2 disabled:opacity-60"
                            whileHover={{ scale: isRegistering ? 1 : 1.05 }}
                            whileTap={{ scale: isRegistering ? 1 : 0.95 }}
                          >
                            {isRegistering ? (
                              <>
                                <Loader2
                                  className="animate-spin mr-2"
                                  size={20}
                                />
                                Registering...
                              </>
                            ) : (
                              <>
                                <Zap size={20} />
                                Register {result.domain}
                              </>
                            )}
                          </motion.button>
                        ) : (
                          <motion.a
                            href={explorerTxUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-10 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-105 shadow-lg inline-flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <CheckCircle size={20} />
                            Done • {shortTx}
                            <ExternalLink size={16} />
                          </motion.a>
                        )}
                      </>
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
