"use client";

import { motion } from "framer-motion";
import { FileText, Code, Link, RefreshCw } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="min-h-screen p-6 md:ml-96 md:mr-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        <div className="glass-card p-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Developer Docs
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Contracts, resolution, reverse records — placeholder content
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="text-green-500" />
              <h2 className="text-xl font-semibold text-foreground">
                Contracts
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Addresses, ABI links, and network deployments.
            </p>
            <ul className="list-disc ml-5 text-gray-600 dark:text-gray-400 text-sm space-y-1">
              <li>Registry: 0x0000...0000 (Placeholder)</li>
              <li>Resolver: 0x0000...0000 (Placeholder)</li>
              <li>Controller: 0x0000...0000 (Placeholder)</li>
            </ul>
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Link className="text-blue-500" />
              <h2 className="text-xl font-semibold text-foreground">
                Resolve Name → Address
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              How to resolve a domain to a wallet address.
            </p>
            <pre className="text-xs p-3 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-auto">
              {`// Pseudo-code (placeholder)
const address = await resolver.getAddress('alice.hotdog');
console.log(address);`}
            </pre>
          </div>

          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <RefreshCw className="text-purple-500" />
              <h2 className="text-xl font-semibold text-foreground">
                Reverse: Address → Name
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              How to find the primary name for an address.
            </p>
            <pre className="text-xs p-3 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-auto">
              {`// Pseudo-code (placeholder)
const name = await reverseResolver.getName('0x1234...abcd');
console.log(name);`}
            </pre>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
