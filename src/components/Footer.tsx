'use client';

import { motion } from 'framer-motion';
import { Globe, Shield, Zap, Star, Heart, Twitter, MessageCircle, Send, Sailboat, Plus } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="glass-card rounded-2xl p-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="md:col-span-2">
              <motion.div
                className="flex items-center space-x-3 mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 abstract-green-gradient rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white text-xl font-bold">🌭</span>
                </div>
                <div>
                  <h3 className="text-2xl font-inter text-foreground font-bold transition-colors duration-300">
                    HotDog Name Service
                  </h3>
                  <p className="text-sm font-inter text-gray-600 dark:text-gray-300 transition-colors duration-300">
                    The coolest domain registry on Abstract. Search, mint, and flex your hotdog identity with style.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-inter text-foreground font-semibold mb-4 transition-colors duration-300">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#discover" className="text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors font-inter">
                    Discover Domains
                  </a>
                </li>
                <li>
                  <a href="#my-domains" className="text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors font-inter">
                    My Domains
                  </a>
                </li>
                <li>
                  <a href="#docs" className="text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors font-inter">
                    Docs
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors font-inter">
                    About
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-inter text-foreground font-semibold mb-4 transition-colors duration-300">Connect</h4>
              <div className="flex space-x-3">
                <motion.a
                  href="https://twitter.com/AbstractHotDogs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900 rounded-full flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Twitter size={18} className="text-gray-600 dark:text-gray-400" />
                </motion.a>
                <motion.a
                  href="https://discord.gg/abstracthotdogs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-100 dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900 rounded-full flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <MessageCircle size={18} className="text-gray-600 dark:text-gray-400" />
                </motion.a>
                <motion.a
                  href="#"
                  className="w-10 h-10 bg-gray-100 dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900 rounded-full flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Send size={18} className="text-gray-600 dark:text-gray-400" />
                </motion.a>
                <motion.a
                  href="#"
                  className="w-10 h-10 bg-gray-100 dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900 rounded-full flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Sailboat size={18} className="text-gray-600 dark:text-gray-400" />
                </motion.a>
                <motion.a
                  href="#"
                  className="w-10 h-10 bg-gray-100 dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900 rounded-full flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus size={18} className="text-gray-600 dark:text-gray-400" />
                </motion.a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-8 transition-colors duration-300"></div>

          {/* Copyright and Fun Message */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-sm font-inter text-gray-500 dark:text-gray-400 transition-colors duration-300">
                © 2025 HotDog Name Service. All rights reserved. Made with 🌭 + ❤️ by the HotDogs team
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-6 py-3 rounded-2xl transition-colors duration-300">
              <p className="text-sm font-inter text-gray-600 dark:text-gray-300 transition-colors duration-300">
                Keep your domains hot and your Abstract dreams sizzling! 🔥✨
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
