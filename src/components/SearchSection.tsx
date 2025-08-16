'use client';

import { motion } from 'framer-motion';
import { Search, Sparkles, Zap, Shield, Globe } from 'lucide-react';
import { useState } from 'react';

export default function SearchSection() {
  const [domainName, setDomainName] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!domainName.trim()) return;
    
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
    }, 2000);
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-background">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hotdog-pattern">
        {/* Floating Hotdogs */}
        <motion.div
          className="absolute top-20 left-10 text-6xl opacity-20"
          animate={{ 
            y: [-20, 20, -20],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🌭
        </motion.div>
        
        {/* Bouncing Buns */}
        <motion.div
          className="absolute top-40 right-20 text-4xl opacity-25"
          animate={{ 
            y: [0, -25, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🥖
        </motion.div>
        
        {/* Rotating Mustard */}
        <motion.div
          className="absolute bottom-40 left-20 text-5xl opacity-20"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          🧂
        </motion.div>
        
        {/* Sparkling Stars */}
        <motion.div
          className="absolute top-60 left-1/4 text-3xl opacity-30"
          animate={{ 
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ⭐
        </motion.div>
        
        {/* Floating Ketchup */}
        <motion.div
          className="absolute bottom-60 right-1/4 text-4xl opacity-25"
          animate={{ 
            y: [-15, 15, -15],
            x: [-5, 5, -5],
            rotate: [0, 3, -3, 0]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🍅
        </motion.div>
      </div>

      <div className="text-center z-10 max-w-5xl mx-auto">
        {/* Main Heading */}
        <motion.h1
          className="text-6xl md:text-8xl font-pixelify mb-6 hotdog-gradient-text drop-shadow-2xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Your Web3 Name, HotDog-Style
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-foreground/90 font-silkscreen mb-12 max-w-3xl mx-auto font-medium leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          On Abstract, everything's fast, cheap, and fun. Claim your hotdog name — one sizzling identity for all your wallets, dApps, and community flexing.
        </motion.p>

        {/* Search Container */}
        <motion.div
          className="relative max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          {/* Search Input */}
          <div className="relative group">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-ketchup via-mustard to-hotdog-bun rounded-3xl p-1 opacity-80 blur-sm group-hover:opacity-100 transition-opacity duration-300"
              animate={{ 
                background: [
                  "linear-gradient(135deg, #e74c3c 0%, #f39c12 50%, #f4d03f 100%)",
                  "linear-gradient(135deg, #f39c12 0%, #f4d03f 50%, #e74c3c 100%)",
                  "linear-gradient(135deg, #f4d03f 0%, #e74c3c 50%, #f39c12 100%)",
                  "linear-gradient(135deg, #e74c3c 0%, #f39c12 50%, #f4d03f 100%)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <input
              type="text"
              placeholder="Search for a name like vind.hotdog"
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
              className="relative w-full px-16 py-6 text-xl font-pixelify bg-black/40 backdrop-blur-xl border-0 rounded-3xl text-foreground placeholder-foreground/50 focus:outline-none focus:ring-4 focus:ring-secondary/30 transition-all duration-300 shadow-2xl"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-secondary text-2xl z-10" />
            
            {/* Sparkles effect */}
            <motion.div
              className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10"
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Sparkles className="text-hotdog-bun text-2xl" />
            </motion.div>
          </div>

          {/* Search Button */}
          <motion.button
            onClick={handleSearch}
            disabled={isSearching || !domainName.trim()}
            className="mt-6 juicy-button px-12 py-4 text-xl font-pixelify text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-xl disabled:transform-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSearching ? (
              <motion.div className="flex items-center space-x-2">
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>Searching...</span>
              </motion.div>
            ) : (
              '🔥 Check Availability'
            )}
          </motion.button>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          {[
            { 
              icon: <Globe className="w-8 h-8" />, 
              title: 'Decentralized', 
              desc: 'Built on Abstract\'s blockchain — true ownership with zero middlebuns 🍔',
              color: 'from-blue-500 to-cyan-500'
            },
            { 
              icon: <Shield className="w-8 h-8" />, 
              title: 'Secure', 
              desc: 'Cryptographically grilled 🔐 — your names stay spicy and safe.',
              color: 'from-green-500 to-emerald-500'
            },
            { 
              icon: <Zap className="w-8 h-8" />, 
              title: 'Fast', 
              desc: 'Abstract chain = instant resolution ⚡ no waiting, no soggy buns.',
              color: 'from-yellow-500 to-orange-500'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="glass-card p-8 rounded-3xl text-center shadow-2xl border border-white/10 hover:border-white/20 transition-all duration-300 group"
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-pixelify text-foreground mb-3 font-semibold">{feature.title}</h3>
              <p className="text-foreground/70 font-silkscreen text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
