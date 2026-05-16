import React from 'react';
import { Layout } from './components/Layout';
import { WatchdogChat } from './components/WatchdogChat';
import { BudgetDashboard } from './components/BudgetDashboard';
import { SMSMockup } from './components/SMSMockup';
import { COUNTIES, County, CountyDocument } from './data';
import { MapPin, Search, ChevronRight, FileText, Info, BarChart3, MessageSquare, Bell, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { GazetteMonitor } from './components/GazetteMonitor';

export default function App() {
  const [selectedCounty, setSelectedCounty] = React.useState<County | null>(null);
  const [selectedDoc, setSelectedDoc] = React.useState<CountyDocument | null>(null);
  const [activeTab, setActiveTab] = React.useState<'chat' | 'dashboard'>('chat');

  const handleCountySelect = (county: County) => {
    setSelectedCounty(county);
    setSelectedDoc(null);
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar: Selectors */}
        <aside className="lg:col-span-3 space-y-6 shrink-0">
          <section>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Select Kaunti</label>
            <div className="space-y-1">
              {COUNTIES.map((county) => (
                <button
                  key={county.id}
                  onClick={() => handleCountySelect(county)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-lg font-semibold transition-all",
                    selectedCounty?.id === county.id
                      ? "bg-slate-100 border border-slate-300 text-slate-900 shadow-sm"
                      : "bg-white border border-transparent text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded font-mono">{county.code}</span>
                    <span>{county.name} County</span>
                  </div>
                  {selectedCounty?.id === county.id && <ChevronRight size={14} className="text-brand-blue" />}
                </button>
              ))}
            </div>
          </section>

          <AnimatePresence mode="wait">
            {selectedCounty ? (
              <motion.section
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-2"
              >
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Resource Hub</label>
                {selectedCounty.documents.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={cn(
                      "w-full p-3 text-left rounded-r-md border-l-4 transition-all group",
                      selectedDoc?.id === doc.id
                        ? "bg-blue-50 border-blue-600 text-blue-900 shadow-sm"
                        : "bg-white border-transparent hover:bg-slate-50 text-slate-700"
                    )}
                  >
                    <p className="text-xs font-bold leading-snug">{doc.title}</p>
                    <p className={cn(
                      "text-[10px] mt-1 uppercase tracking-tighter opacity-70",
                      selectedDoc?.id === doc.id ? "text-blue-700" : "text-slate-500"
                    )}>
                      {doc.type} • {doc.year} FY
                    </p>
                  </button>
                ))}
              </motion.section>
            ) : (
              <section className="bg-slate-100 border border-slate-200 p-6 rounded-xl text-center">
                <Info className="mx-auto mb-2 text-slate-400" size={24} />
                <p className="text-[11px] text-slate-500 font-medium">Select a county to access its resource hub.</p>
              </section>
            )}
          </AnimatePresence>

          <section className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-2 mb-2 text-emerald-800">
              <Bell size={14} className="animate-bounce" />
              <p className="text-[11px] font-bold uppercase tracking-wider">SMS Digest Active</p>
            </div>
            <p className="text-[10px] text-emerald-700 leading-relaxed mb-3">
              Receive weekly plain-language summaries for your ward directly via SMS/USSD.
            </p>
            <button className="w-full bg-emerald-600 text-white text-[10px] font-bold uppercase py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
              Subscribe Now
            </button>
          </section>
        </aside>

        {/* Right Content: Main Interaction */}
        <main className="lg:col-span-6 space-y-6 min-w-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="flex border-b border-slate-100 bg-slate-50/50">
              <button
                onClick={() => setActiveTab('chat')}
                className={cn(
                  "flex-1 py-4 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 border-b-2 transition-all",
                  activeTab === 'chat' ? "border-brand-blue text-brand-blue bg-white" : "border-transparent text-slate-400 hover:text-slate-600"
                )}
              >
                <MessageSquare size={14} />
                Watchdog Chat Assistant
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={cn(
                  "flex-1 py-4 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 border-b-2 transition-all",
                  activeTab === 'dashboard' ? "border-brand-blue text-brand-blue bg-white" : "border-transparent text-slate-400 hover:text-slate-600"
                )}
              >
                <BarChart3 size={14} />
                Expenditure Visuals
              </button>
            </div>

            <div className="flex-1">
              <AnimatePresence mode="wait">
                {activeTab === 'chat' ? (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <WatchdogChat document={selectedDoc} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4"
                  >
                    <BudgetDashboard document={selectedDoc} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <section className="bg-blue-900 rounded-2xl p-6 text-white shadow-xl flex items-center justify-between gap-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
            <div className="relative z-10 space-y-2">
              <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Fiscal Transparency Score</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black">72</span>
                <span className="text-lg text-blue-300 mb-1 opacity-60">/ 100</span>
              </div>
              <div className="w-48 bg-blue-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-brand-emerald h-full w-[72%] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
            </div>
            <div className="relative z-10 text-right max-w-[200px]">
              <p className="text-[10px] text-blue-200 leading-tight italic">
                "Digital transparency is the first step towards public accountability and transformation."
              </p>
            </div>
          </section>
        </main>

        {/* Right Pane: Alerts */}
        <aside className="lg:col-span-3 space-y-6">
          <GazetteMonitor />

          <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-4">

            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Public Notice</h3>
            <SMSMockup />
            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              Scan to subscribe to ward broadcasts via USSD *000#
            </p>
          </div>
        </aside>
      </div>
    </Layout>
  );
}

