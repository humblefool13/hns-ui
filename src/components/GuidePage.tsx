'use client';

import { motion } from 'framer-motion';
import { BookOpen, Play, FileText, Users, Globe, Shield, Zap, ArrowRight, ExternalLink, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function GuidePage() {
  const quickStartSteps = [
    { step: 1, title: 'Connect Wallet', description: 'Connect your Abstract Global Wallet to get started', icon: '🔗' },
    { step: 2, title: 'Search for Names', description: 'Search for available HotDog names in the registry', icon: '🔍' },
    { step: 3, title: 'Register Domain', description: 'Claim your chosen name with a simple transaction', icon: '✅' },
    { step: 4, title: 'Configure Settings', description: 'Set up resolvers, records, and other domain settings', icon: '⚙️' }
  ];

  const tutorials = [
    { title: 'Getting Started with HotDog Names', duration: '5 min', difficulty: 'Beginner', category: 'Basics' },
    { title: 'Setting Up Domain Resolvers', duration: '8 min', difficulty: 'Intermediate', category: 'Configuration' },
    { title: 'Managing Multiple Domains', duration: '12 min', difficulty: 'Intermediate', category: 'Management' },
    { title: 'Advanced Security Features', duration: '15 min', difficulty: 'Advanced', category: 'Security' },
    { title: 'Integrating with dApps', duration: '10 min', difficulty: 'Intermediate', category: 'Integration' },
    { title: 'Bulk Domain Operations', duration: '18 min', difficulty: 'Advanced', category: 'Management' }
  ];

  const faqs = [
    {
      question: 'What is a HotDog name?',
      answer: 'A HotDog name is a human-readable identifier on the Abstract blockchain that maps to wallet addresses, making it easier to send transactions and interact with dApps.'
    },
    {
      question: 'How much does it cost to register a name?',
      answer: 'Registration costs vary based on the name length and popularity. Most names cost between 0.1 to 2 ABSTRACT tokens, with premium names costing more.'
    },
    {
      question: 'Can I transfer my HotDog name to another wallet?',
      answer: 'Yes! HotDog names are fully transferable NFTs. You can transfer them to any wallet address, sell them on marketplaces, or gift them to others.'
    },
    {
      question: 'What happens if I don\'t renew my domain?',
      answer: 'If you don\'t renew your domain before expiration, it becomes available for others to register. Make sure to set up auto-renewal or mark your calendar!'
    }
  ];

  return (
    <div className="min-h-screen p-6 md:ml-96 md:mr-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Page Header */}
        <div className="glass-card p-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            HotDog Name Service Guide
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Everything you need to know about using and managing HotDog names on Abstract
          </p>
        </div>

        {/* Quick Start */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Play className="text-green-500" />
            Quick Start Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStartSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-500 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  {step.icon}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400 font-semibold mb-2">
                  Step {step.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tutorials */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <BookOpen className="text-green-500" />
            Video Tutorials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((tutorial, index) => (
              <motion.div
                key={tutorial.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-500 transition-all duration-300 cursor-pointer group hover:shadow-lg"
              >
                <div className="w-full h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                  <Play className="text-white" size={48} />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    tutorial.difficulty === 'Beginner' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                    tutorial.difficulty === 'Intermediate' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
                    'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                  }`}>
                    {tutorial.difficulty}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                    {tutorial.category}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{tutorial.title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>⏱️ {tutorial.duration}</span>
                  <ArrowRight className="text-green-500 group-hover:translate-x-1 transition-transform duration-300" size={16} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <FileText className="text-green-500" />
            Documentation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-500 transition-all duration-300 cursor-pointer group">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Globe className="text-blue-600 dark:text-blue-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Core Concepts</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Learn about domains, resolvers, and the naming system architecture</p>
              <button className="flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors duration-300">
                Read More <ExternalLink size={16} />
              </button>
            </div>
            
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-500 transition-all duration-300 cursor-pointer group">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="text-purple-600 dark:text-purple-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Security & Best Practices</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Security guidelines and best practices for managing your domains</p>
              <button className="flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors duration-300">
                Read More <ExternalLink size={16} />
              </button>
            </div>
            
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-500 transition-all duration-300 cursor-pointer group">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="text-orange-600 dark:text-orange-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">API Reference</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Technical documentation for developers and integrators</p>
              <button className="flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors duration-300">
                Read More <ExternalLink size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Users className="text-green-500" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-green-500 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Info className="text-green-600 dark:text-green-400" size={16} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Community & Support */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Users className="text-green-500" />
            Get Help & Support
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
              <h3 className="text-xl font-bold text-foreground mb-4">Community Resources</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <CheckCircle className="text-green-500" size={16} />
                  <span>Discord Community</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <CheckCircle className="text-green-500" size={16} />
                  <span>Telegram Group</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <CheckCircle className="text-green-500" size={16} />
                  <span>GitHub Discussions</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <CheckCircle className="text-green-500" size={16} />
                  <span>Twitter Support</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
              <h3 className="text-xl font-bold text-foreground mb-4">Need More Help?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Can't find what you're looking for? Our support team is here to help!
              </p>
              <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
