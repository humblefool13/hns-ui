'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Crown, Calendar, DollarSign, ExternalLink, CheckCircle, AlertCircle, ShoppingCart, Zap } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function SearchSection() {
  const [domainName, setDomainName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<null | { type: 'found' | 'not-found'; domain: string; owner?: string; expiration?: string; marketplaces?: { name: string; url: string; icon: string }[] }>(null);

  // Real constraints and pricing (ETH)
  const MAX_REGISTRATION_YEARS = 10;
  const MIN_DOMAIN_LENGTH = 3;
  const MAX_DOMAIN_LENGTH = 20;
  const PRICE_3_CHAR = 0.012;
  const PRICE_4_CHAR = 0.01;
  const PRICE_5_CHAR = 0.008;
  const PRICE_6_CHAR = 0.006;
  const PRICE_7_PLUS = 0.004;

  const parsed = useMemo(() => {
    const input = domainName.trim().toLowerCase();
    if (!input) return '';
    const label = input.includes('.') ? input.split('.')[0] : input;
    return label.replace(/[^a-z0-9-]/g, '');
  }, [domainName]);

  const nameLen = parsed.length;
  const isTooShort = nameLen > 0 && nameLen < MIN_DOMAIN_LENGTH;
  const isTooLong = nameLen > MAX_DOMAIN_LENGTH;

  const pricePerYearEth = useMemo(() => {
    if (nameLen === 0) return 0;
    if (nameLen === 3) return PRICE_3_CHAR;
    if (nameLen === 4) return PRICE_4_CHAR;
    if (nameLen === 5) return PRICE_5_CHAR;
    if (nameLen === 6) return PRICE_6_CHAR;
    if (nameLen >= 7) return PRICE_7_PLUS;
    return 0;
  }, [nameLen]);

  const handleSearch = () => {
    if (!domainName.trim()) return;
    if (isTooShort || isTooLong) return;

    setIsSearching(true);
    setTimeout(() => {
      const found = Math.random() > 0.5;
      if (found) {
        setResult({
          type: 'found',
          domain: domainName,
          owner: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          expiration: '2026-12-15',
          marketplaces: [
            { name: 'OpenSea', url: 'https://opensea.io', icon: '🦄' },
            { name: 'Magic Eden', url: 'https://magiceden.io', icon: '✨' },
            { name: 'ZKMarket', url: 'https://zkmarket.io', icon: '🔒' },
            { name: 'Mintify', url: 'https://mintify.xyz', icon: '🎨' }
          ]
        });
      } else {
        setResult({ type: 'not-found', domain: domainName });
      }
      setIsSearching(false);
      // Scroll to results
      const el = document.querySelector('[data-section="results"]');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 700);
  };

  return (
    <section className="py-12 px-6 md:ml-96 md:mr-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Card */}
        <motion.div
          className="glass-card rounded-2xl p-12 text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Main Heading */}
          <motion.h1
            className="text-5xl md:text-7xl font-inter mb-6 text-foreground drop-shadow-lg transition-colors duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            Your Web3 Name, HotDog-Style
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-inter mb-12 max-w-3xl mx-auto font-medium leading-relaxed transition-colors duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            On Abstract, everything&apos;s fast, cheap, and fun. Claim your hotdog name — one sizzling identity for all your wallets, dApps, and community flexing.
          </motion.p>

          {/* Search Section */}
          <motion.div
            className="relative max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          >
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10 transition-colors duration-300" size={24} />
              <input
                type="text"
                placeholder="Search for a name like vind.hotdog"
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
                className="relative w-full px-16 py-6 text-xl font-inter bg-background border-2 border-gray-200 dark:border-gray-600 rounded-3xl text-foreground placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-400 transition-all duration-300 shadow-lg"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Sparkles className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10 transition-colors duration-300" size={24} />
            </div>
            
            <motion.button
              className="abstract-green-gradient mt-6 px-12 py-4 text-xl font-inter text-white shadow-lg relative overflow-hidden rounded-2xl disabled:opacity-60"
              disabled={!domainName.trim() || isTooShort || isTooLong || isSearching}
              whileHover={{ scale: isSearching ? 1 : 1.05 }}
              whileTap={{ scale: isSearching ? 1 : 0.95 }}
              onClick={handleSearch}
            >
              {isSearching ? 'Searching…' : 'Check Availability'}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: [-250, 250] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
            </motion.button>

            {(isTooShort || isTooLong) && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                Name must be {MIN_DOMAIN_LENGTH}-{MAX_DOMAIN_LENGTH} characters.
              </p>
            )}
            {!isTooShort && !isTooLong && nameLen > 0 && (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                Estimated price: <span className="font-semibold">{pricePerYearEth.toFixed(3)} ETH</span> per year
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
              {result.type === 'found' ? (
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
                    <h2 className="text-2xl font-bold text-foreground mb-1">Domain Already Taken</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-mono text-green-500">{result.domain}</span> is already registered
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="p-6 border border-white/10 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Crown className="text-yellow-500" size={18} />
                        <h3 className="font-semibold text-foreground">Owner</h3>
                      </div>
                      <p className="font-mono text-sm text-gray-600 dark:text-gray-300 break-all">{result.owner}</p>
                    </div>

                    <div className="p-6 border border-white/10 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="text-blue-500" size={18} />
                        <h3 className="font-semibold text-foreground">Expires</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">{result.expiration}</p>
                    </div>

                    <div className="p-6 border border-white/10 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <DollarSign className="text-green-500" size={18} />
                        <h3 className="font-semibold text-foreground">Registration Cost</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">{pricePerYearEth.toFixed(3)} ETH / year (by length)</p>
                    </div>

                    <div className="p-6 border border-white/10 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <ShoppingCart className="text-purple-500" size={18} />
                        <h3 className="font-semibold text-foreground">Available On</h3>
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
                            transition={{ duration: 0.2, delay: 0.2 + idx * 0.05 }}
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
                    <h2 className="text-2xl font-bold text-foreground mb-1">Domain Available!</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-mono text-green-500">{result.domain}</span> is ready to be claimed
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="p-6 border border-white/10 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <Calendar className="text-blue-500" size={18} />
                        <h3 className="font-semibold text-foreground">Registration Period</h3>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {[1,2,3,5,10].filter((y) => y <= MAX_REGISTRATION_YEARS).map((year) => (
                          <button key={year} className="p-3 rounded-xl border-2 text-sm hover:border-green-400 transition-all">
                            {year} {year === 1 ? 'Year' : 'Years'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 border border-white/10 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <DollarSign className="text-green-500" size={18} />
                        <h3 className="font-semibold text-foreground">Estimated Cost</h3>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-500 mb-1">
                          {pricePerYearEth.toFixed(3)} ETH / year
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">Pricing based on name length</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <motion.button
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-10 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-105 shadow-lg inline-flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Zap size={20} />
                      Mint {result.domain}
                    </motion.button>
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
