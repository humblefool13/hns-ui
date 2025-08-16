'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import Navbar from '../components/Navbar';
import SearchSection from '../components/SearchSection';
import DomainResults from '../components/DomainResults';
import Footer from '../components/Footer';

interface DomainResult {
  name: string;
  available: boolean;
  owner?: string;
  expiration?: string;
  price?: string;
}

export default function Home() {
  const [searchResults, setSearchResults] = useState<DomainResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Mock search function - in real app, this would call your blockchain API
  const handleDomainSearch = async (domainName: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock results - in real app, this would come from your blockchain
    const mockResults: DomainResult[] = [
      {
        name: domainName,
        available: Math.random() > 0.5, // Random availability for demo
        owner: Math.random() > 0.5 ? '0x1234...5678' : undefined,
        expiration: Math.random() > 0.5 ? '2025-12-31' : undefined,
        price: '0.01 ETH'
      },
      {
        name: `${domainName}2`,
        available: Math.random() > 0.5,
        owner: Math.random() > 0.5 ? '0x8765...4321' : undefined,
        expiration: Math.random() > 0.5 ? '2025-06-15' : undefined,
        price: '0.02 ETH'
      }
    ];
    
    setSearchResults(mockResults);
    setShowResults(true);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <div className="pt-20"> {/* Account for fixed navbar */}
        {/* Search Section */}
        <SearchSection />
        
        {/* Domain Results */}
        <DomainResults 
          results={searchResults}
          isVisible={showResults}
        />
        
        {/* Community Callout / Mid-Section */}
        <motion.section
          className="py-24 px-4 text-center relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-ketchup/10 via-mustard/10 to-hotdog-bun/10" />
          <div className="absolute inset-0 hotdog-pattern opacity-20" />
          
          <div className="max-w-5xl mx-auto relative z-10">
            <motion.h2
              className="text-5xl md:text-7xl font-pixelify mb-8 hotdog-gradient-text drop-shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Ready to Claim Your HotDog Name?
            </motion.h2>
            <motion.p
              className="text-xl text-foreground/90 font-silkscreen mb-12 max-w-3xl mx-auto font-medium leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Join the Abstract pioneers grabbing hotdog names before they're gone. Be early, be loud, and own your slice of the bun.
            </motion.p>
            <motion.button
              className="juicy-button px-16 py-6 text-2xl font-pixelify text-white shadow-2xl relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Start Searching Now
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: [-100, 100] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.button>
          </div>
        </motion.section>
      </div>
      
      {/* Footer */}
      <Footer />
    </main>
  );
}
