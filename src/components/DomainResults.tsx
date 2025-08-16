'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, User, Calendar, RefreshCw, Star, Zap, Shield } from 'lucide-react';

interface DomainResult {
  name: string;
  available: boolean;
  owner?: string;
  expiration?: string;
  price?: string;
}

interface DomainResultsProps {
  results: DomainResult[];
  isVisible: boolean;
}

export default function DomainResults({ results, isVisible }: DomainResultsProps) {
  if (!isVisible || results.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.section
        className="py-20 px-4 relative overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 hotdog-pattern opacity-10" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.h2
            className="text-4xl md:text-5xl font-pixelify text-center mb-16 hotdog-gradient-text drop-shadow-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Domain Search Results
          </motion.h2>

          <div className="space-y-8">
            {results.map((result, index) => (
              <motion.div
                key={result.name}
                className="glass-card rounded-3xl p-8 shadow-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Domain Name */}
                  <div className="flex-1">
                    <h3 className="text-3xl font-pixelify text-foreground mb-3 font-semibold">
                      {result.name}
                    </h3>
                    <div className="flex items-center space-x-4">
                      {result.available ? (
                        <div className="flex items-center space-x-3 text-success">
                          <CheckCircle size={24} className="text-green-500" />
                          <span className="font-pixelify font-semibold text-lg">Available!</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3 text-error">
                          <XCircle size={24} className="text-red-500" />
                          <span className="font-pixelify font-semibold text-lg">Taken</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Section */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    {result.available ? (
                      <>
                        <motion.button
                          className="juicy-button px-8 py-4 text-white font-pixelify flex items-center space-x-3 shadow-xl relative overflow-hidden"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Star size={20} />
                          <span>Mint Domain</span>
                          <span className="text-sm opacity-90">({result.price || '0.01 ETH'})</span>
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{ x: [-100, 100] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          />
                        </motion.button>
                        <motion.button
                          className="px-8 py-4 border-2 border-secondary text-secondary font-pixelify hover:bg-secondary hover:text-white transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Add to Cart
                        </motion.button>
                      </>
                    ) : (
                      <div className="text-right">
                        <div className="text-sm text-foreground/70 font-pixelify mb-4 space-y-2">
                          <div className="flex items-center space-x-2">
                            <User size={16} className="text-foreground/60" />
                            <span>Owner: {result.owner}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar size={16} className="text-foreground/60" />
                            <span>Expires: {result.expiration}</span>
                          </div>
                        </div>
                        <motion.button
                          className="px-6 py-3 border-2 border-accent text-accent font-pixelify hover:bg-accent hover:text-white transition-all duration-300 rounded-xl flex items-center space-x-2 shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <RefreshCw size={16} />
                          <span>Renew</span>
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Info for Available Domains */}
                {result.available && (
                  <motion.div
                    className="mt-6 pt-6 border-t border-white/10"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center p-4 glass-card rounded-2xl border border-white/5">
                        <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                          <Star size={24} />
                        </div>
                        <div className="text-foreground/90 font-pixelify font-medium">Perfect Match</div>
                      </div>
                      <div className="text-center p-4 glass-card rounded-2xl border border-white/5">
                        <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                          <Zap size={24} />
                        </div>
                        <div className="text-foreground/90 font-pixelify font-medium">Instant Setup</div>
                      </div>
                      <div className="text-center p-4 glass-card rounded-2xl border border-white/5">
                        <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                          <Shield size={24} />
                        </div>
                        <div className="text-foreground/90 font-pixelify font-medium">Forever Yours</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Bulk Actions */}
          {results.some(r => r.available) && (
            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                className="juicy-button px-12 py-5 text-white font-pixelify text-xl shadow-2xl relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Star className="inline-block mr-3 w-6 h-6" />
                Mint All Available ({results.filter(r => r.available).length})
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: [-100, 100] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
