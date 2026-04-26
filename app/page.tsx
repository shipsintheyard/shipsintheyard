"use client";
import { useState } from 'react';
import Stars from '../components/Stars';
import Header, { type TabId } from '../components/Header';
import HomeTab from '../components/HomeTab';
import ShipItTab from '../components/ShipItTab';
import DockTab from '../components/DockTab';
import WidgetsTab from '../components/WidgetsTab';
import BoardingTab from '../components/boarding/BoardingTab';

export default function ShipyardPlatform() {
  const [activeTab, setActiveTab] = useState<TabId>('landing');

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0f1419_0%,#1a1f2e_50%,#0f1419_100%)] text-text-body font-mono">
      <Stars />
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main>
        {activeTab === 'landing' && <HomeTab onNavigate={(tab) => setActiveTab(tab as TabId)} />}
        {activeTab === 'ship' && <ShipItTab />}
        {activeTab === 'dock' && <DockTab />}
        {activeTab === 'widgets' && <WidgetsTab />}
        {activeTab === 'boarding' && <BoardingTab />}
      </main>

      {/* Footer */}
      <footer className="px-10 py-9 border-t border-[rgba(136,192,255,0.1)] flex justify-between items-center">
        <div className="text-[11px] text-text-dim">© 2026 THE SHIPYARD. We ship widgets.</div>
        <div className="flex gap-5">
          {['Twitter', 'Docs', 'GitHub'].map(link => (
            <a key={link} href="#" className="text-[11px] text-text-muted no-underline hover:text-primary transition-colors">
              {link}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
