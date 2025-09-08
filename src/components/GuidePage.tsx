"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Play,
  Users,
  ArrowRight,
  ExternalLink,
  Info
} from "lucide-react";

export default function GuidePage() {
  const quickStartSteps = [
    {
      step: 1,
      title: "Connect Wallet",
      description: "Connect your Abstract Global Wallet to get started",
      icon: "🔗"
    },
    {
      step: 2,
      title: "Search for Names",
      description: "Search for available HotDog names in the registry",
      icon: "🔍"
    },
    {
      step: 3,
      title: "Register Domain",
      description: "Claim your chosen name with a simple transaction",
      icon: "✅"
    },
    {
      step: 4,
      title: "Flex your domain",
      description: "Show your friends and family your new domain!",
      icon: "💪"
    }
  ];

  const tutorials = [
    {
      title: "Getting Started with HotDog Names",
      duration: "5 min",
      difficulty: "Beginner",
      category: "Basics"
    },
    {
      title: "Setting Up Domain Resolvers",
      duration: "8 min",
      difficulty: "Intermediate",
      category: "Configuration"
    },
    {
      title: "Managing Multiple Domains",
      duration: "12 min",
      difficulty: "Intermediate",
      category: "Management"
    }
  ];

  const faqs = [
    {
      question: "What is a HotDog name?",
      answer:
        "A HotDog name is a human-readable identifier on the Abstract blockchain that maps to wallet addresses, making it easier to send transactions and interact with dApps."
    },
    {
      question: "How much does it cost to register a name?",
      answer:
        "Registration costs vary based on the name length. Search for a name to see the cost."
    },
    {
      question: "Can I transfer my HotDog name to another wallet?",
      answer:
        "Yes! HotDog names are fully transferable NFTs. You can transfer them to any wallet address, sell them on marketplaces, or gift them to others."
    },
    {
      question: "What happens if I don't renew my domain?",
      answer:
        "If you don't renew your domain before expiration, it expires and becomes available for others to register. Make sure to mark your calendar!"
    }
  ];

  return (
    <div className="min-h-screen p-6 md:mr-6 md:ml-96">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-6xl space-y-6"
      >
        {/* Page Header */}
        <div className="hover:border-dim-green dark:hover:border-bright-green relative mt-6 rounded-2xl border border-gray-300 bg-gray-100 py-6 text-center shadow-md backdrop-blur-xl transition-all duration-300 hover:bg-white hover:shadow-lg md:mt-0 dark:border-gray-700/50 dark:bg-[#1e1e1e] dark:hover:bg-black">
          <h1 className="mb-4 text-2xl font-bold text-black md:text-4xl dark:text-white">
            HotDog Name Service Guide
          </h1>
          <p className="text-md text-gray-600 md:text-lg dark:text-gray-300">
            Everything you need to know about using and managing HotDog names on
            Abstract
          </p>
        </div>

        {/* Quick Start */}
        <div className="hover:border-dim-green dark:hover:border-bright-green relative rounded-2xl border border-gray-300 bg-gray-100 p-6 text-center shadow-md backdrop-blur-xl transition-all duration-300 hover:bg-white hover:shadow-lg dark:border-gray-700/50 dark:bg-[#1e1e1e] dark:hover:bg-black">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-black dark:text-white">
            <Play className="text-green-500" />
            Quick Start Guide
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {quickStartSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="rounded-xl border border-gray-200 p-6 text-center transition-all duration-300 hover:border-green-500 dark:border-gray-700"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl dark:bg-green-900/30">
                  {step.icon}
                </div>
                <div className="mb-2 text-sm font-semibold text-green-600 dark:text-green-400">
                  Step {step.step}
                </div>
                <h3 className="mb-2 font-semibold text-black dark:text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tutorials */}
        <div className="hover:border-dim-green dark:hover:border-bright-green relative rounded-2xl border border-gray-300 bg-gray-100 p-6 shadow-md backdrop-blur-xl transition-all duration-300 hover:bg-white hover:shadow-lg dark:border-gray-700/50 dark:bg-[#1e1e1e] dark:hover:bg-black">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-black dark:text-white">
            <BookOpen className="text-green-500" />
            Video Tutorials
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tutorials.map((tutorial, index) => (
              <motion.div
                key={tutorial.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group cursor-pointer rounded-xl border border-gray-200 p-6 transition-all duration-300 hover:border-green-500 hover:shadow-lg dark:border-gray-700"
              >
                <div className="mb-4 flex h-32 w-full items-center justify-center rounded-lg bg-gradient-to-br from-green-400 to-green-600 transition-transform duration-300 group-hover:scale-105">
                  <Play className="text-white" size={48} />
                </div>
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      tutorial.difficulty === "Beginner"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                        : tutorial.difficulty === "Intermediate"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                    }`}
                  >
                    {tutorial.difficulty}
                  </span>
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                    {tutorial.category}
                  </span>
                </div>
                <h3 className="mb-2 font-semibold text-black dark:text-white">
                  {tutorial.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>⏱️ {tutorial.duration}</span>
                  <ArrowRight
                    className="text-green-500 transition-transform duration-300 group-hover:translate-x-1"
                    size={16}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="hover:border-dim-green dark:hover:border-bright-green relative rounded-2xl border border-gray-300 bg-gray-100 p-6 shadow-md backdrop-blur-xl transition-all duration-300 hover:bg-white hover:shadow-lg dark:border-gray-700/50 dark:bg-[#1e1e1e] dark:hover:bg-black">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-black dark:text-white">
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
                className="rounded-xl border border-gray-200 p-6 transition-all duration-300 hover:border-green-500 dark:border-gray-700"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <Info
                      className="text-green-600 dark:text-green-400"
                      size={16}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 font-semibold text-black dark:text-white">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Community & Support */}
        <div className="hover:border-dim-green dark:hover:border-bright-green relative rounded-2xl border border-gray-300 bg-gray-100 p-6 text-center shadow-md backdrop-blur-xl transition-all duration-300 hover:bg-white hover:shadow-lg dark:border-gray-700/50 dark:bg-[#1e1e1e] dark:hover:bg-black">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-black dark:text-white">
            <Users className="text-green-500" />
            Get Help & Support
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="rounded-xl border border-gray-200 p-6 hover:border-green-500 dark:border-gray-700">
              <h3 className="mb-4 text-xl font-bold text-black dark:text-white">
                Community Resources
              </h3>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Join our Discord to get help, share feedback, and suggest new
                features.
              </p>
              <div className="mt-6">
                <a
                  href="https://discord.com/invite/abstracthotdogs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-[#1e1e1e]"
                >
                  Join Discord
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
