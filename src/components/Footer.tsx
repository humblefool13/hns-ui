'use client';

import { motion } from 'framer-motion';
import { Twitter, Github, MessageCircle, Heart, Globe, Shield, Zap } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background/40 backdrop-blur-xl border-t border-foreground/10 relative overflow-hidden shadow-2xl">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hotdog-pattern opacity-20">
        <motion.div
          className="absolute bottom-10 left-10 text-3xl opacity-30"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          🌭
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-20 text-2xl opacity-25"
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          🥖
        </motion.div>
        <motion.div
          className="absolute top-20 left-1/4 text-2xl opacity-20"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          🧂
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <motion.div 
              className="flex items-center space-x-4 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="w-14 h-14 bg-gradient-to-br from-ketchup via-mustard to-hotdog-bun rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-3xl">🌭</span>
              </motion.div>
              <div>
                <h3 className="text-2xl font-pixelify text-foreground hotdog-gradient-text">
                  HotDog Name Service
                </h3>
                <p className="text-sm font-silkscreen text-foreground/70 font-medium">
                  Web3 Domain Portal
                </p>
              </div>
            </motion.div>
            <p className="text-foreground/80 font-silkscreen mb-6 max-w-lg leading-relaxed">
              The coolest domain registry on Abstract. Search, mint, and flex your hotdog identity with style. 🚀
            </p>
            
            {/* Feature Icons */}
            <div className="flex space-x-4">
              {[
                { icon: <Globe className="w-5 h-5" />, color: "from-blue-500 to-cyan-500" },
                { icon: <Shield className="w-5 h-5" />, color: "from-green-500 to-emerald-500" },
                { icon: <Zap className="w-5 h-5" />, color: "from-yellow-500 to-orange-500" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.4 }}
                >
                  {item.icon}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-pixelify text-foreground mb-6 font-semibold">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Discover Domains', href: '#discover' },
                { name: 'My Domains', href: '#domains' },
                { name: 'Docs', href: '#docs' },
                { name: 'About', href: '#about' }
              ].map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href={link.href}
                    className="text-foreground/70 hover:text-secondary font-silkscreen transition-colors duration-200 font-medium"
                  >
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-lg font-pixelify text-foreground mb-6 font-semibold">Connect</h4>
            <div className="flex space-x-4">
              {[
                { icon: Twitter, href: '#', label: 'Twitter', color: "from-blue-400 to-blue-600" },
                { icon: Github, href: '#', label: 'GitHub', color: "from-gray-600 to-gray-800" },
                { icon: MessageCircle, href: '#', label: 'Discord', color: "from-indigo-500 to-purple-600" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className={`w-12 h-12 bg-gradient-to-br ${social.color} hover:scale-110 rounded-xl flex items-center justify-center text-white transition-all duration-300 shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-foreground/70 font-silkscreen text-sm mb-4 md:mb-0">
            © 2025 HotDog Name Service. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-2 text-foreground/70 font-silkscreen text-sm">
            <span>Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              🌭
            </motion.div>
            <span>+</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
            >
              ❤️
            </motion.div>
            <span>by the HotDogs team</span>
          </div>
        </motion.div>

        {/* Fun Message */}
        <motion.div
          className="text-center mt-8 p-6 glass-card rounded-2xl shadow-xl border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-foreground/90 font-silkscreen font-medium">
            Keep your domains hot and your Abstract dreams sizzling! 🔥✨
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
