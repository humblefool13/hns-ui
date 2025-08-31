"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchSection from "../components/SearchSection";
import ManagePage from "../components/ManagePage";
import ActivityPage from "../components/ActivityPage";
import GuidePage from "../components/GuidePage";
import DocsPage from "../components/DocsPage";
import Navbar from "../components/Navbar";

type PageType = "search" | "manage" | "activity" | "guide" | "docs";

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState<PageType>("search");

  const renderPage = () => {
    switch (currentPage) {
      case "search":
        return <SearchSection />;
      case "manage":
        return <ManagePage />;
      case "activity":
        return <ActivityPage />;
      case "guide":
        return <GuidePage />;
      case "docs":
        return <DocsPage />;
      default:
        return <SearchSection />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
