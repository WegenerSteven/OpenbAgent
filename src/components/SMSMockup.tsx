import React from 'react';
import { Smartphone, Send, Bell } from 'lucide-react';
import { motion } from 'motion/react';

export function SMSMockup() {
  return (
    <div className="bg-kenya-black p-6 rounded-3xl shadow-2xl relative overflow-hidden max-w-[280px] mx-auto border-4 border-gray-800">
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-gray-800 rounded-full" />
      
      <div className="mt-8 space-y-4">
        {/* SMS bubble 1 */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800 text-white p-3 rounded-2xl rounded-tl-none text-[10px] leading-snug"
        >
          <span className="font-bold text-kenya-red block mb-1">MWANANCHI-WATCH</span>
          Kibra Ward Budget Update: 
          KES 150M allocated for Water Boreholes in 2024. 
          Auditor finding: 40% of previous funds unexplained.
          Reply "INFO" for details.
        </motion.div>

        {/* SMS bubble 2 */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className="bg-gray-800 text-white p-3 rounded-2xl rounded-tl-none text-[10px] leading-snug"
        >
          <span className="font-bold text-kenya-red block mb-1">MWANANCHI-WATCH</span>
          HANSARD ALERT:
          Your MCA supported the new Market Levy Bill yesterday.
          Estimated cost to small traders: +KES 50/day.
          Visit watchdog.ke to voice opinion.
        </motion.div>

        {/* Fake Input */}
        <div className="mt-12 bg-gray-900 rounded-full h-8 flex items-center px-3 border border-white/10">
          <div className="flex-1 text-[8px] opacity-40">Type message...</div>
          <Send size={10} className="text-kenya-red" />
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <div className="w-10 h-10 border-2 border-gray-800 rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-gray-800 rounded-sm" />
        </div>
      </div>
    </div>
  );
}
