'use client';

import { motion } from 'framer-motion';
import { Menu, Sparkles, Sun, Moon, Star } from 'lucide-react';
import { useTheme } from '../app/ThemeProvider';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-background/20 backdrop-blur-xl border-b border-foreground/10 shadow-2xl"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              className="w-12 h-12 bg-gradient-to-br from-ketchup via-mustard to-hotdog-bun rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-2xl">🌭</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: [-100, 100] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-pixelify text-foreground hotdog-gradient-text">
                HotDog Name Service
              </h1>
              <p className="text-sm font-silkscreen text-foreground/70 font-medium">
                Abstract's spiciest web3 domain registry
              </p>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <motion.a 
              href="#discover" 
              className="text-foreground/80 hover:text-secondary transition-colors font-pixelify font-medium relative group"
              whileHover={{ scale: 1.05 }}
            >
              Discover
              <motion.div
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-ketchup to-mustard group-hover:w-full transition-all duration-300"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
              />
            </motion.a>
            <motion.a 
              href="#domains" 
              className="text-foreground/80 hover:text-secondary transition-colors font-pixelify font-medium relative group"
              whileHover={{ scale: 1.05 }}
            >
              Domains
              <motion.div
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-ketchup to-mustard group-hover:w-full transition-all duration-300"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
              />
            </motion.a>
            <motion.a 
              href="#about" 
              className="text-foreground/80 hover:text-secondary transition-colors font-pixelify font-medium relative group"
              whileHover={{ scale: 1.05 }}
            >
              About
              <motion.div
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-ketchup to-mustard group-hover:w-full transition-all duration-300"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
              />
            </motion.a>
            <motion.a 
              href="#docs" 
              className="text-foreground/80 hover:text-secondary transition-colors font-pixelify font-medium relative group"
              whileHover={{ scale: 1.05 }}
            >
              Docs
              <motion.div
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-ketchup to-mustard group-hover:w-full transition-all duration-300"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
              />
            </motion.a>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <motion.button
              onClick={toggleTheme}
              className="p-3 text-foreground hover:text-secondary bg-foreground/5 hover:bg-foreground/10 rounded-xl transition-all duration-200 relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'dark' ? (
                  <Sun size={20} className="text-yellow-400" />
                ) : (
                  <Moon size={20} className="text-blue-400" />
                )}
              </motion.div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: [-100, 100] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.button>

            {/* Connect Wallet Button */}
            <motion.button
              className="juicy-button px-6 py-3 text-white font-pixelify text-sm flex items-center space-x-2 shadow-lg relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Star size={16} />
              <span>Mint My Name</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: [-100, 100] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-3 text-foreground hover:text-secondary bg-foreground/5 hover:bg-foreground/10 rounded-xl transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu size={24} />
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
