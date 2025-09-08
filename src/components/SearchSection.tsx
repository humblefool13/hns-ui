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
  Loader2
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useContract } from "../contexts/ContractContext";
import { useLoginWithAbstract } from "@abstract-foundation/agw-react";
import NFTSVGCreator from "./NFTSVGCreator";
import OpenSeaIcon from "../assets/opensea.svg";
import MagicEdenIcon from "../assets/magicEden.svg";
import MintifyIcon from "../assets/mintify.svg";
import Image from "next/image";

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
    marketplaces?: {
      name: string;
      url: string;
      icon: any;
    }[];
  }>(null);

  const {
    getRegisteredTLDsRPC,
    resolveDomainRPC,
    getDomainPrice,
    registerDomain,
    isConnected,
    isLoading
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
  const [width, setWidth] = useState(window.innerWidth);

  // Load available TLDs on component mount (works even if not connected via fallback client)
  useEffect(() => {
    const loadTLDs = async () => {
      const tlds = await getRegisteredTLDsRPC();
      setAvailableTLDs(tlds || []);
      setIsLoadingTLDs(false);
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

    if (name.length > 10) {
      return { isValid: false, error: "Name must be 10 characters or less" };
    }

    if (!/^[a-zA-Z0-9]+$/.test(name)) {
      return {
        isValid: false,
        error: "Name can only contain letters and numbers"
      };
    }

    if (name.startsWith(".") || name.endsWith(".")) {
      return {
        isValid: false,
        error: "Name cannot start or end with a &apos;.&apos;"
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
      const domainInfo = await resolveDomainRPC(name, tld);
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
              icon: OpenSeaIcon
            },
            {
              name: "Magic Eden",
              url: `https://magiceden.io/item-details/abstract/${domainInfo.nftAddress}/${domainInfo.tokenId}`,
              icon: MagicEdenIcon
            },
            {
              name: "Mintify",
              url: `https://app.mintify.com/nft/abstract/${domainInfo.nftAddress}/${domainInfo.tokenId}`,
              icon: MintifyIcon
            }
          ]
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
            price
          });
          setCurrentPrice(price);
        } catch (error) {
          console.error("Error getting domain price:", error);
          setResult({
            type: "not-found",
            domain: `${name}.${tld}`,
            tld,
            name
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

    setTimeout(() => {
      if (typeof window !== "undefined" && typeof document !== "undefined") {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth"
        });
      }
    }, 100);
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
    <section className="md:py-none px-2 py-8 md:mr-6 md:ml-96 md:px-6 2xl:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Hero Card */}
        <motion.div
          className="hover:border-dim-green dark:hover:border-bright-green md:px-none relative mt-12 rounded-2xl border border-gray-300 bg-gray-100 px-4 pt-12 text-center shadow-md backdrop-blur-xl transition-all duration-300 hover:bg-white hover:shadow-lg md:mt-0 dark:border-gray-700/50 dark:bg-[#1e1e1e] dark:hover:bg-black"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="group absolute top-[-50px] right-0 z-20 cursor-pointer md:top-6 md:right-6"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
          >
            <div className="relative hidden md:block">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 opacity-80 blur-sm transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500"></div>
              </div>
              <div className="relative rounded-3xl border-2 border-yellow-300 bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 p-2 shadow-2xl transition-all duration-300 group-hover:border-yellow-200 md:rounded-full md:p-4">
                <div className="mb-1 text-lg text-white transition-transform duration-300 group-hover:scale-110 md:text-2xl">
                  👑
                </div>
                <div className="text-xs font-bold tracking-wider text-white transition-transform duration-300 group-hover:scale-105">
                  XP REWARDS
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:animate-pulse group-hover:opacity-100"></div>
              </div>
              <div className="pointer-events-none absolute top-full left-1/2 mt-2 w-64 -translate-x-1/2 translate-y-2 transform rounded-2xl border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50 p-3 opacity-0 shadow-2xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 dark:border-yellow-600 dark:from-yellow-900/90 dark:to-amber-900/90">
                <div className="text-center">
                  <div className="mb-2 flex items-center justify-center gap-1 text-sm font-bold text-yellow-700 dark:text-yellow-200">
                    <span>👑</span>
                    <span>HotDogs NFT XP</span>
                    <span>👑</span>
                  </div>
                  <div className="space-y-1 text-xs text-yellow-700 dark:text-yellow-300">
                    <p className="font-semibold">Abstract Portal:</p>
                    <p>• Earn XP for holding NFTs</p>
                    <p className="mt-2 font-semibold">HotDogs Portal:</p>
                    <p>• 10 points per NFT</p>
                    <p>• Bonus from badges</p>
                    <p className="mt-1 text-xs text-yellow-600 italic dark:text-yellow-400">
                      Level up with badges!
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-r-6 border-b-6 border-l-6 border-r-transparent border-b-yellow-300 border-l-transparent dark:border-b-yellow-600"></div>
              </div>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="pb-10 text-3xl font-bold drop-shadow-lg transition-all duration-300 md:text-7xl"
            style={{
              background:
                "linear-gradient(45deg, #03d26e, #41f09c, #00c466, #22c55e, #16a34a, #03d26e)",
              backgroundSize: "500% 500%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "gradientWave 5s ease-in-out infinite"
            }}
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
            className="text-md mx-auto mb-12 max-w-3xl leading-relaxed font-medium text-gray-700 transition-colors duration-300 md:text-2xl dark:text-gray-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            Your hotdog name isn&apos;t just a domain
            <br />
            it&apos;s your flavor in the web3 cookout.
            <br />
            Own it, flex it, and let it be your web3 flavor.
          </motion.p>

          {/* Available TLDs */}
          {!isLoadingTLDs && availableTLDs.length > 0 && (
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                Available TLDs:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {availableTLDs.map((tld) => (
                  <span
                    key={tld}
                    className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 transition-all duration-300 hover:scale-105 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-800/50"
                  >
                    .{tld}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Search Section */}
          <motion.div
            className="relative mx-auto mb-8 max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <div className="relative">
              <Search
                className="absolute top-1/2 left-3 z-10 -translate-y-1/2 transform text-gray-400 transition-colors duration-300 md:left-6 dark:text-gray-500"
                size={width > 768 ? 24 : 20}
              />
              <input
                type="text"
                placeholder={
                  width > 768
                    ? "Search for a name like sausage.hotdogs"
                    : "sausage.hotdogs"
                }
                value={domainName}
                onChange={(e) => {
                  setDomainName(e.target.value);
                  setHasAttemptedSearch(false);
                }}
                className="bg-background text-md relative w-full rounded-3xl border-2 border-gray-300 px-10 py-4 text-black placeholder-gray-400 shadow-lg transition-all duration-300 focus:border-green-400 focus:ring-4 focus:ring-green-300 focus:outline-none md:px-16 md:py-6 md:text-xl dark:border-gray-600 dark:text-white dark:placeholder-gray-500 dark:shadow-md dark:shadow-white"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Sparkles
                className="absolute top-1/2 right-3 z-10 -translate-y-1/2 transform text-gray-400 transition-colors duration-300 md:right-6 dark:text-gray-500"
                size={width > 768 ? 24 : 20}
              />
            </div>

            <motion.button
              className="relative mt-6 inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 to-green-600 px-12 py-4 text-xl font-medium text-white shadow-lg transition-all duration-300 hover:from-green-600 hover:to-green-700 hover:shadow-xl disabled:opacity-60"
              disabled={
                !domainName.trim() || !validation.isValid || isSearching
              }
              whileHover={{ scale: isSearching ? 1 : 1.05 }}
              whileTap={{ scale: isSearching ? 1 : 0.95 }}
              onClick={handleSearch}
            >
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={20} />
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
              className="mx-auto mt-16 max-w-4xl"
            >
              {result.type === "found" ? (
                <div className="hover:border-dim-green dark:hover:border-bright-green rounded-2xl border border-gray-300 bg-gray-100 p-8 shadow-md backdrop-blur-xl transition-all duration-300 hover:bg-white hover:shadow-lg dark:border-gray-700/50 dark:bg-[#1e1e1e] dark:hover:bg-black">
                  <div className="mb-6 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30"
                    >
                      <AlertCircle className="text-red-500" size={32} />
                    </motion.div>
                    <h2 className="mb-1 text-2xl font-bold text-black dark:text-white">
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
                    className="mb-6 flex justify-center"
                  >
                    <div className="group relative">
                      <NFTSVGCreator
                        name={result.name}
                        tld={result.tld}
                        className="group-hover:shadow-3xl h-48 w-48 rounded-2xl border-2 border-gray-200 shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:border-red-300 group-hover:shadow-red-500/50 dark:border-gray-600 dark:group-hover:border-red-400"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent" />

                      {/* Pulsing Ring Effect */}
                      <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent transition-all duration-300 group-hover:animate-pulse group-hover:border-red-400/50" />
                    </div>
                  </motion.div>

                  <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="rounded-xl border border-gray-200 p-6 transition-all duration-300 hover:border-green-500 dark:border-white/10">
                      <div className="mb-2 flex items-center gap-3">
                        <Crown className="text-yellow-500" size={18} />
                        <h3 className="font-semibold text-black dark:text-white">
                          Owner
                        </h3>
                      </div>
                      <p className="font-mono text-sm break-all text-gray-600 dark:text-gray-300">
                        {result.owner}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 p-6 transition-all duration-300 hover:border-green-500 dark:border-white/10">
                      <div className="mb-2 flex items-center gap-3">
                        <Calendar className="text-blue-500" size={18} />
                        <h3 className="font-semibold text-black dark:text-white">
                          Expires
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">
                        {result.expiration}
                      </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 p-6 transition-all duration-300 hover:border-green-500 dark:border-white/10">
                      <div className="mb-2 flex items-center gap-3">
                        <ShoppingCart className="text-purple-500" size={18} />
                        <h3 className="font-semibold text-black dark:text-white">
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
                            className="inline-flex items-center gap-2 rounded-lg bg-gray-200 px-3 py-1 text-sm text-gray-700 transition-all duration-300 hover:bg-green-100 hover:text-green-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-green-900/30 dark:hover:text-green-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.2,
                              delay: 0.2 + idx * 0.05
                            }}
                          >
                            <Image
                              src={mkt.icon}
                              alt={mkt.name}
                              width={16}
                              height={16}
                              className="dark:invert"
                            />
                            <span className="sr-only">{mkt.name}</span>
                            {mkt.name}
                            <ExternalLink size={12} />
                          </motion.a>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl border border-gray-200 p-6 transition-all duration-300 hover:border-green-500 dark:border-white/10">
                      <div className="mb-2 flex items-center gap-3">
                        <ExternalLink className="text-green-500" size={18} />
                        <h3 className="font-semibold text-black dark:text-white">
                          Explorer
                        </h3>
                      </div>
                      <div className="flex flex-col gap-3">
                        <motion.a
                          href={`https://sepolia.abscan.org/nft/${result.nftAddress}/${result.tokenId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-fit items-center gap-2 rounded-lg bg-gray-200 px-3 py-2 text-sm text-gray-700 transition-all duration-300 hover:bg-green-100 hover:text-green-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-green-900/30 dark:hover:text-green-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View on Abscan
                          <ExternalLink size={12} />
                        </motion.a>
                        {result.nftAddress && result.tokenId && (
                          <p className="text-xs break-all text-gray-500 dark:text-gray-400">
                            {result.nftAddress} / {result.tokenId}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hover:border-dim-green dark:hover:border-bright-green rounded-2xl border border-gray-300 bg-gray-100 p-8 shadow-md backdrop-blur-xl transition-all duration-300 hover:bg-white hover:shadow-lg dark:border-gray-700/50 dark:bg-[#1e1e1e] dark:hover:bg-black">
                  <div className="mb-6 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30"
                    >
                      <CheckCircle className="text-green-500" size={32} />
                    </motion.div>
                    <h2 className="mb-1 text-2xl font-bold text-black dark:text-white">
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
                    className="mb-6 flex justify-center"
                  >
                    <div className="group relative">
                      <NFTSVGCreator
                        name={result.name}
                        tld={result.tld}
                        className="group-hover:shadow-3xl h-48 w-48 rounded-2xl border-2 border-green-400 shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:border-green-300 group-hover:shadow-green-500/50 dark:border-green-500 dark:group-hover:border-green-400"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent" />

                      {/* Pulsing Ring Effect */}
                      <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent transition-all duration-300 group-hover:animate-pulse group-hover:border-green-400/50" />
                    </div>
                  </motion.div>

                  <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="rounded-xl border border-gray-200 p-6 transition-all duration-300 hover:border-green-500 dark:border-white/10">
                      <div className="mb-3 flex items-center gap-3">
                        <Calendar className="text-blue-500" size={18} />
                        <h3 className="font-semibold text-black dark:text-white">
                          Registration Period
                        </h3>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3, 5, 10].map((year) => (
                          <button
                            key={year}
                            onClick={() => setSelectedYears(year)}
                            className={`rounded-xl border-2 p-3 text-sm text-black transition-all duration-300 hover:border-green-500 dark:text-white ${
                              selectedYears === year
                                ? "border-green-400 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                : "border-gray-200 hover:border-green-400 dark:border-gray-600"
                            }`}
                          >
                            {year} {year === 1 ? "Year" : "Years"}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 p-6 transition-all duration-300 hover:border-green-500 dark:border-white/10">
                      <div className="mb-3 flex items-center gap-3">
                        <DollarSign className="text-green-500" size={18} />
                        <h3 className="font-semibold text-black dark:text-white">
                          Estimated Cost
                        </h3>
                      </div>
                      <div className="text-center">
                        <div className="mb-1 text-3xl font-bold text-green-500">
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
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-10 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-600 hover:to-blue-700 hover:shadow-2xl"
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
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-10 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-green-600 hover:to-green-700 hover:shadow-2xl disabled:opacity-60"
                            whileHover={{ scale: isRegistering ? 1 : 1.05 }}
                            whileTap={{ scale: isRegistering ? 1 : 0.95 }}
                          >
                            {isRegistering ? (
                              <>
                                <Loader2
                                  className="mr-2 animate-spin"
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
                            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-10 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-green-600 hover:to-green-700 hover:shadow-2xl"
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
