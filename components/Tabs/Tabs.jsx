"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const TABS = [
  { name: "Overview", path: "/" },
  { name: "Standings", path: "/standings" },
  { name: "Fixtures", path: "/fixtures" },
];

const Tabs = () => {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(pathname);

  useEffect(() => {
    setActiveTab(pathname);
  }, [pathname]);

  return (
    <div className=" ">
      <div className="max-w-5xl mx-auto px-4">
        <nav className="flex space-x-8 font-montserrat overflow-x-auto py-2 scrollbar-hide">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.path;
            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={`relative px-1 py-2 text-sm font-bold transition-colors
                  ${
                    isActive
                      ? "text-white"
                      : "text-white/60 hover:text-white/80 "
                  }`}
              >
                {tab.name}
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                    layoutId="activeTab"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Tabs;
