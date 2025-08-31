"use client";

import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  RefreshCw,
  Star,
  Zap,
  Shield,
} from "lucide-react";

export default function DomainResults() {
  // Mock data for demonstration
  const mockResults = [
    {
      name: "vind.hotdog",
      available: true,
      price: "0.01 ETH",
    },
    {
      name: "crypto.hotdog",
      available: false,
      owner: "0x1234...5678",
      expiration: "2025-12-31",
    },
    {
      name: "web3.hotdog",
      available: true,
      price: "0.02 ETH",
    },
  ];

  return (
    <motion.section
      className="py-12 px-6"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header Card */}
        <motion.div
          className="glass-card rounded-2xl p-8 text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-5xl font-inter text-center mb-4 text-foreground drop-shadow-lg transition-colors duration-300">
            Domain Search Results
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 font-inter transition-colors duration-300">
            Find and manage your perfect hotdog domain names
          </p>
        </motion.div>

        {/* Results Cards */}
        <div className="space-y-6 mb-12">
          {mockResults.map((result, index) => (
            <motion.div
              key={result.name}
              className="glass-card rounded-2xl p-8 transition-all duration-300"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Domain Name */}
                <div className="flex-1">
                  <h3 className="text-3xl font-inter text-foreground mb-3 font-semibold transition-colors duration-300">
                    {result.name}
                  </h3>
                  <div className="flex items-center space-x-4">
                    {result.available ? (
                      <div className="flex items-center space-x-3 text-green-600">
                        <CheckCircle size={24} className="text-green-500" />
                        <span className="font-inter font-semibold text-lg">
                          Available!
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3 text-red-600">
                        <XCircle size={24} className="text-red-500" />
                        <span className="font-inter font-semibold text-lg">
                          Taken
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Section */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {result.available ? (
                    <>
                      <motion.button
                        className="abstract-green-gradient px-8 py-4 text-white font-inter flex items-center space-x-3 shadow-lg relative overflow-hidden rounded-2xl"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Star size={20} />
                        <span>Mint Domain</span>
                        <span className="text-sm opacity-90">
                          ({result.price})
                        </span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{ x: [-100, 100] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                      </motion.button>
                      <motion.button
                        className="px-8 py-4 border-2 border-green-500 text-green-600 font-inter hover:bg-green-500 hover:text-white transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Add to Cart
                      </motion.button>
                    </>
                  ) : (
                    <div className="text-gray-600 dark:text-gray-300 font-inter transition-colors duration-300">
                      <p className="mb-2">Owner: {result.owner}</p>
                      <p className="mb-4">Expires: {result.expiration}</p>
                      <motion.button
                        className="px-8 py-4 border-2 border-green-500 text-green-600 font-inter hover:bg-green-500 hover:text-white transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Renew
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div
            className="glass-card p-6 rounded-2xl text-center group hover:scale-105 transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-12 h-12 abstract-green-gradient rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap size={24} className="text-white" />
            </div>
            <h4 className="text-lg font-inter mb-2 text-foreground transition-colors duration-300">
              Instant Resolution
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-inter leading-relaxed transition-colors duration-300">
              Abstract chain provides lightning-fast domain resolution
            </p>
          </motion.div>

          <motion.div
            className="glass-card p-6 rounded-2xl text-center group hover:scale-105 transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="w-12 h-12 abstract-green-gradient rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield size={24} className="text-white" />
            </div>
            <h4 className="text-lg font-inter mb-2 text-foreground transition-colors duration-300">
              Secure Ownership
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-inter leading-relaxed transition-colors duration-300">
              Your domains are cryptographically secured on-chain
            </p>
          </motion.div>

          <motion.div
            className="glass-card p-6 rounded-2xl text-center group hover:scale-105 transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="w-12 h-12 abstract-green-gradient rounded-xl flex items-center justify-center mx-auto mb-4">
              <Star size={24} className="text-white" />
            </div>
            <h4 className="text-lg font-inter mb-2 text-foreground transition-colors duration-300">
              Easy Management
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-inter leading-relaxed transition-colors duration-300">
              Simple interface for managing all your hotdog domains
            </p>
          </motion.div>
        </div>

        {/* CTA Button Card */}
        <motion.div
          className="glass-card rounded-2xl p-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            className="abstract-green-gradient px-12 py-6 text-xl font-inter text-white shadow-lg relative overflow-hidden rounded-2xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Star size={20} className="mr-2" />
            Mint All Available
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: [-100, 100] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
}
