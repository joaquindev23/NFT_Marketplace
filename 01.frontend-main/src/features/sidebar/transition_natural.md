import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

export default function Sidebar() {
  const [sidebarHidden, setSidebarHidden] = useState(true);

  const showSidebar = () => {
    setSidebarHidden(false);
  };

  const hideSidebar = () => {
    setSidebarHidden(true);
  };

  return (
    <motion.div
      id="sidebar-container"
      initial={{ width: '8%' }}
      animate={{ width: sidebarHidden ? '4.5%' : '23%' }}
      transition={{ duration: 0.5 }}
      onMouseEnter={showSidebar}
      onMouseLeave={hideSidebar}
      className="z-20 hidden h-screen w-72 bg-dark p-5 pt-8 md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col"
    >
      <div className="sticky top-0  text-white">
        <div className="mb-4">Logo Here</div>
        <div className="relative">
          <ul className="">
            <li className="absolute flex" style={{ top: 0, left: 0 }}>
              <motion.span
                initial={{ opacity: 1, scale: 1, rotate: 0, skewX: 0, skewY: 0 }}
                animate={{
                  opacity: sidebarHidden ? 1 : 1,
                  scale: sidebarHidden ? 1 : 1.1,
                  rotate: sidebarHidden ? 0 : 10,
                  skewX: sidebarHidden ? 0 : 10,
                  skewY: sidebarHidden ? 0 : -10,
                }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="inline-flex"
              >
                <AcademicCapIcon className="h-5 w-5" />
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: sidebarHidden ? 0 : 1, x: sidebarHidden ? -20 : 0 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 15 }}
                className="ml-4 inline-flex "
              >
                Item 1
              </motion.span>
            </li>
            <li className="absolute flex" style={{ top: '2rem', left: 0 }}>
              <motion.span
                initial={{ opacity: 1, scale: 1, rotate: 0, skewX: 0, skewY: 0 }}
                animate={{
                  opacity: sidebarHidden ? 1 : 1,
                  scale: sidebarHidden ? 1 : 1.1,
                  rotate: sidebarHidden ? 0 : 10,
                  skewX: sidebarHidden ? 0 : 10,
                  skewY: sidebarHidden ? 0 : -10,
                }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="inline-flex"
              >
                <AcademicCapIcon className="h-5 w-5" />
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: sidebarHidden ? 0 : 1, x: sidebarHidden ? -20 : 0 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 15 }}
                className="ml-4 inline-flex "
              >
                Item 1
              </motion.span>
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
