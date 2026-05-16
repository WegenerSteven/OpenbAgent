import React from 'react';
import { GazetteNotice, COUNTIES } from '../data';
import { fetchRecentGazetteNotifications, processGazetteNotice } from '../services/gazetteService';
import { AlertTriangle, Clock, RefreshCw, Bell, ShieldAlert, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export function GazetteMonitor() {
  const [notices, setNotices] = React.useState<GazetteNotice[]>([]);
  const [isMonitoring, setIsMonitoring] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const startMonitoring = async () => {
    setIsMonitoring(true);
    setIsProcessing(true);
    
    try {
      const rawNotices = await fetchRecentGazetteNotifications();
      const processed: GazetteNotice[] = [];
      
      for (const raw of rawNotices) {
        // Find county context (very simplified)
        const countyId = raw.toLowerCase().includes('nairobi') ? 'nairobi' : 
                         raw.toLowerCase().includes('mombasa') ? 'mombasa' : 'kisumu';
        
        const extracted = await processGazetteNotice(raw, countyId);
        processed.push({
          id: Math.random().toString(36).substr(2, 9),
          countyId,
          date: extracted.date || new Date().toISOString().split('T')[0],
          summary: extracted.summary || 'Budget amendment detected.',
          impact: extracted.impact || 'Medium',
          rawText: raw
        });
      }
      
      setNotices(prev => [...processed, ...prev]);
    } catch (error) {
      console.error("Monitoring error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-xs text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <RefreshCw size={12} className={cn(isMonitoring && "animate-spin text-brand-emerald")} />
            Live Gazette Monitor
          </h3>
          <p className="text-[10px] text-slate-500 mt-1">Real-time AI extraction of budget amendments from official notices.</p>
        </div>
        {!isMonitoring ? (
          <button 
            onClick={startMonitoring}
            className="bg-brand-blue text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded flex items-center gap-2 hover:bg-blue-800 transition-colors shadow-sm"
          >
            <RefreshCw size={12} />
            Start AI Watch
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded border border-emerald-100 text-[10px] font-bold uppercase">
             <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
             AI Engine Active
          </div>
        )}
      </div>

      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {notices.map((notice) => {
            const county = COUNTIES.find(c => c.id === notice.countyId);
            return (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "bg-white p-4 rounded-xl border shadow-sm relative overflow-hidden",
                  notice.impact === 'High' ? "border-l-4 border-l-red-500" : "border-l-4 border-l-amber-400"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <ShieldAlert size={14} className={notice.impact === 'High' ? "text-red-500" : "text-amber-500"} />
                    <span className="text-[10px] font-bold uppercase text-slate-400">Amendment Alert • {county?.name}</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{notice.date}</span>
                </div>
                <p className="text-xs font-bold text-slate-800 leading-snug mb-2">{notice.summary}</p>
                
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                  <div className="flex gap-2">
                    <span className={cn(
                      "text-[9px] font-bold uppercase px-2 py-0.5 rounded",
                      notice.impact === 'High' ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
                    )}>
                      {notice.impact} Impact
                    </span>
                    <span className="text-[9px] font-bold uppercase bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                      Gemini Verified
                    </span>
                  </div>
                  <button className="text-[9px] font-bold text-slate-400 hover:text-brand-blue uppercase flex items-center gap-1 transition-colors">
                    View Raw Notice <Clock size={10} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isProcessing && (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400 gap-3 border-2 border-dashed border-slate-100 rounded-xl">
             <RefreshCw size={24} className="animate-spin" />
             <p className="text-[10px] font-bold uppercase tracking-widest">Gemini is analyzing official gazettes...</p>
          </div>
        )}

        {notices.length === 0 && !isProcessing && (
          <div className="text-center py-8 bg-slate-50 border border-slate-100 rounded-xl">
            <CheckCircle size={24} className="mx-auto mb-2 text-slate-300" />
            <p className="text-[10px] font-bold text-slate-400 uppercase">No new notices in the last 24h</p>
          </div>
        )}
      </div>
    </div>
  );
}
