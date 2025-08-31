"use client";

import { motion } from "framer-motion";
import { Clock, ArrowRightLeft, ShoppingBag, Sparkles } from "lucide-react";

type EventItem = {
  id: number;
  type: "sale" | "transfer" | "mint";
  domain: string;
  from?: string;
  to?: string;
  txHash: string;
  price?: string;
  timestamp: string; // ISO string or relative
};

export default function ActivityPage() {
  const events: EventItem[] = [
    {
      id: 1,
      type: "sale",
      domain: "ai.hotdog",
      price: "1.2 ABSTRACT",
      from: "0x1234...abcd",
      to: "0x9876...cdef",
      txHash: "0xsale123",
      timestamp: "2025-01-05T12:30:00Z",
    },
    {
      id: 2,
      type: "transfer",
      domain: "brand.hotdog",
      from: "0xaaaa...bbbb",
      to: "0xcccc...dddd",
      txHash: "0xtransfer456",
      timestamp: "2025-01-05T11:10:00Z",
    },
    {
      id: 3,
      type: "mint",
      domain: "zesty.hotdog",
      to: "0xeeee...ffff",
      txHash: "0xmint789",
      timestamp: "2025-01-05T10:55:00Z",
    },
    {
      id: 4,
      type: "sale",
      domain: "defi.hotdog",
      price: "0.9 ABSTRACT",
      from: "0x1111...2222",
      to: "0x3333...4444",
      txHash: "0xsale999",
      timestamp: "2025-01-04T19:00:00Z",
    },
  ];

  const getIcon = (type: EventItem["type"]) => {
    if (type === "sale")
      return <ShoppingBag className="text-green-500" size={18} />;
    if (type === "transfer")
      return <ArrowRightLeft className="text-blue-500" size={18} />;
    return <Sparkles className="text-purple-500" size={18} />;
  };

  const getLabel = (type: EventItem["type"]) => {
    if (type === "sale") return "Sale";
    if (type === "transfer") return "Transfer";
    return "Mint";
  };

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
            Domain Activity
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            All sales, mints, and transfers are shown here.
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="grid grid-cols-1 gap-4">
            {events
              .sort(
                (a, b) =>
                  new Date(b.timestamp).getTime() -
                  new Date(a.timestamp).getTime()
              )
              .map((evt, idx) => (
                <motion.div
                  key={evt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.05 }}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                      {getIcon(evt.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-foreground">
                          {getLabel(evt.type)}
                        </span>
                        <span className="font-mono text-foreground">
                          {evt.domain}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {evt.type === "sale" && (
                          <span>
                            {evt.from} → {evt.to} • {evt.price}
                          </span>
                        )}
                        {evt.type === "transfer" && (
                          <span>
                            {evt.from} → {evt.to}
                          </span>
                        )}
                        {evt.type === "mint" && <span>Minted to {evt.to}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />{" "}
                      <span>{new Date(evt.timestamp).toLocaleString()}</span>
                    </div>
                    <a
                      href="#"
                      className="text-green-600 dark:text-green-400 hover:underline"
                    >
                      View Tx
                    </a>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
