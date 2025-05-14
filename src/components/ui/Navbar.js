import React from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames';

const Navbar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'view', label: 'View Tasks' },
    { id: 'add', label: 'Add Task' },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-white"
          >
            Task Manager
          </motion.h1>
          <div className="flex space-x-4">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onTabChange(tab.id)}
                className={classNames(
                  'px-4 py-2 rounded-md font-medium transition-colors duration-200',
                  activeTab === tab.id
                    ? 'bg-white text-blue-600'
                    : 'text-white hover:bg-blue-500/30'
                )}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 