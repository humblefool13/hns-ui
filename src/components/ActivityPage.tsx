"use client";

import { motion } from "framer-motion";
import {
  Clock,
  ArrowRightLeft,
  Sparkles,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { useContract } from "../contexts/ContractContext";
import { useState, useEffect } from "react";

type EventItem = {
  id: string; // transaction hash + log index
  type: "register" | "renew" | "transfer" | "expire";
  domain: string;
  txHash: string;
  blockNumber: number;
  tokenId: string;
  timestamp: number;
  tld: string;
  expiration?: string;
  from?: string;
  to?: string;
};

export default function ActivityPage() {
  const { nameServiceContracts, getRegisteredTLDsRPC, hnsManagerContract } =
    useContract();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events on component mount
  useEffect(() => {
    const getEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const tlds = await getRegisteredTLDsRPC();
        if (!tlds || tlds.length === 0) {
          setEvents([]);
          setIsLoading(false);
          return;
        }

        let events: EventItem[] = [];
        for (const tld of tlds) {
          const contract = nameServiceContracts.get(tld);
          if (!contract) continue;
          const response = await fetch("/api/ns/getLogs", {
            method: "POST",
            body: JSON.stringify({ address: contract.address, tld })
          });
          const data = await response.json();
          console.log(data);
          events.push(...data.events);
        }
        events = events.sort((a, b) => b.timestamp - a.timestamp);
        setEvents(events);
      } catch (error) {
        setError("Failed to fetch events: " + error);
      } finally {
        setIsLoading(false);
      }
    };

    getEvents();
  }, []);

  const getIcon = (type: EventItem["type"]) => {
    if (type === "register") return <Sparkles size={18} />;
    if (type === "renew") return <Clock size={18} />;
    if (type === "transfer") return <ArrowRightLeft size={18} />;
    if (type === "expire") return <AlertCircle size={18} />;
    return <Sparkles className="text-gray-500" size={18} />;
  };

  const getLabel = (type: EventItem["type"]) => {
    if (type === "register") return "Registered";
    if (type === "renew") return "Renewed";
    if (type === "transfer") return "Transferred";
    if (type === "expire") return "Expired";
    return "Unknown";
  };

  const getTypeStyles = (type: EventItem["type"]) => {
    if (type === "register")
      return {
        labelBg: "bg-green-100 dark:bg-green-900/30",
        labelText: "text-green-700 dark:text-green-300"
      };
    if (type === "renew")
      return {
        labelBg: "bg-blue-100 dark:bg-blue-900/30",
        labelText: "text-blue-700 dark:text-blue-300"
      };
    if (type === "transfer")
      return {
        labelBg: "bg-purple-100 dark:bg-purple-900/30",
        labelText: "text-purple-700 dark:text-purple-300"
      };
    if (type === "expire")
      return {
        labelBg: "bg-red-100 dark:bg-red-900/30",
        labelText: "text-red-700 dark:text-red-300"
      };
    return {
      labelBg: "bg-gray-100 dark:bg-gray-800",
      labelText: "text-gray-700 dark:text-gray-300"
    };
  };

  return (
    <div className="min-h-screen p-6 md:mr-6 md:ml-96">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-6xl space-y-6"
      >
        <div className="hover:border-dim-green dark:hover:border-bright-green relative rounded-2xl border border-gray-300 bg-gray-100 py-6 text-center shadow-md backdrop-blur-xl transition-all duration-300 hover:bg-white hover:shadow-lg dark:border-gray-700/50 dark:bg-[#1e1e1e] dark:hover:bg-black">
          <h1 className="mb-2 text-4xl font-bold text-black dark:text-white">
            Domain Activity
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            All sales, mints, and transfers are shown here.
          </p>
        </div>

        <div className="hover:border-dim-green dark:hover:border-bright-green relative rounded-2xl border border-gray-300 bg-gray-100 p-6 text-center shadow-md backdrop-blur-xl transition-all duration-300 hover:bg-white hover:shadow-lg dark:border-gray-700/50 dark:bg-[#1e1e1e] dark:hover:bg-black">
          {isLoading ? (
            <div className="py-8 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-green-500"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Loading activity...
              </p>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
              <p className="mt-2 text-red-600 dark:text-red-400">{error}</p>
            </div>
          ) : events.length === 0 ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800">
                <Clock className="h-8 w-8 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-200">
                No Activity Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Domain registrations, renewals, and transfers will appear here
              </p>
            </div>
          ) : (
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
                    className="flex items-center justify-between rounded-xl border border-gray-200 p-4 transition-all duration-300 hover:scale-102 hover:border-green-500 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${getTypeStyles(evt.type).labelBg} ${getTypeStyles(evt.type).labelText}`}
                      >
                        {getIcon(evt.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-sm ${getTypeStyles(evt.type).labelBg} ${getTypeStyles(evt.type).labelText}`}
                          >
                            {getLabel(evt.type)}
                          </span>
                          <span className="font-mono text-black dark:text-white">
                            {evt.domain}.{evt.tld}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {evt.type === "register" && <span>{evt.from}</span>}
                          {evt.type === "renew" && <span>{evt.from}</span>}
                          {evt.type === "transfer" && (
                            <span>
                              {evt.from} → {evt.to}
                            </span>
                          )}
                          {evt.type === "expire" && (
                            <span>Expired (was owned by {evt.from})</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />{" "}
                        <span>
                          {new Date(evt.timestamp * 1000).toLocaleString()}
                        </span>
                      </div>
                      <a
                        href={`https://sepolia.abscan.org/tx/${evt.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline dark:text-green-400"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </motion.div>
                ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
