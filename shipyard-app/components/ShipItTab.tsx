"use client";
import { useState } from 'react';

const engines: Record<string, { name: string; lp: number; burn: number; icon: string; desc: string }> = {
  navigator: { name: 'NAVIGATOR', lp: 80, burn: 20, icon: '⭐', desc: 'Maximum LP depth, steady burns' },
  polaris: { name: 'POLARIS', lp: 70, burn: 30, icon: '✦', desc: 'Balanced growth, higher burn rate' },
  supernova: { name: 'SUPERNOVA', lp: 50, burn: 50, icon: '☄️', desc: 'Maximum deflation, 50/50 split' }
};

export default function ShipItTab() {
  const [launchStep, setLaunchStep] = useState(1);
  const [selectedEngine, setSelectedEngine] = useState('navigator');

  return (
    <div className="animate-in px-10 py-10 max-w-[950px] mx-auto">
      <div className="mb-9">
        <div className="text-[10px] text-primary tracking-[3px] mb-1.5">THE SHIPYARD</div>
        <h1 className="font-heading text-[32px] font-bold text-white">LAUNCH A VESSEL</h1>
      </div>

      {/* Progress */}
      <div className="flex mb-9 relative">
        <div className="absolute top-[18px] left-[70px] right-[70px] h-0.5 bg-border-primary">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-dark transition-[width] duration-300 shadow-[0_0_10px_rgba(136,192,255,0.5)]"
            style={{ width: `${((launchStep - 1) / 2) * 100}%` }}
          />
        </div>

        {['VESSEL INFO', 'ENGINE SELECT', 'LAUNCH'].map((step, i) => (
          <div key={i} className="flex-1 flex flex-col items-center z-[1]">
            <div
              onClick={() => setLaunchStep(i + 1)}
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[13px] cursor-pointer ${
                launchStep > i
                  ? 'bg-gradient-to-br from-primary to-primary-dark text-bg-base border-none'
                  : launchStep === i + 1
                  ? 'bg-bg-glass border-2 border-primary text-text-muted shadow-[0_0_20px_rgba(136,192,255,0.3)]'
                  : 'bg-[rgba(15,20,25,0.5)] border border-border-primary text-text-muted'
              }`}
            >
              {launchStep > i ? '✓' : i + 1}
            </div>
            <span className={`mt-2.5 text-[9px] tracking-[1px] ${
              launchStep === i + 1 ? 'text-primary' : 'text-text-dim'
            }`}>
              {step}
            </span>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="rounded-2xl p-9 bg-bg-glass border border-[rgba(136,192,255,0.1)] backdrop-blur-[10px] min-h-[450px]">
        {/* Step 1 */}
        {launchStep === 1 && (
          <div>
            <h2 className="font-heading text-lg font-semibold text-white mb-7 flex items-center gap-2.5">
              <span className="text-primary">01</span> VESSEL INFORMATION
            </h2>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[9px] text-primary mb-2 tracking-[2px]">TOKEN NAME</label>
                <input
                  type="text"
                  placeholder="e.g. STARSHIP"
                  className="w-full p-3.5 bg-bg-input border border-border-primary rounded-lg text-white text-sm font-mono outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-[9px] text-primary mb-2 tracking-[2px]">SYMBOL</label>
                <input
                  type="text"
                  placeholder="e.g. STAR"
                  className="w-full p-3.5 bg-bg-input border border-border-primary rounded-lg text-white text-sm font-mono outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[9px] text-primary mb-2 tracking-[2px]">DESCRIPTION</label>
                <textarea
                  placeholder="Chart your vessel's journey..."
                  rows={3}
                  className="w-full p-3.5 bg-bg-input border border-border-primary rounded-lg text-white text-sm font-mono outline-none resize-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-[9px] text-primary mb-2 tracking-[2px]">VESSEL IMAGE</label>
                <div className="h-[120px] bg-bg-input border-2 border-dashed border-[rgba(136,192,255,0.2)] rounded-lg flex flex-col items-center justify-center text-text-dim text-xs cursor-pointer hover:border-primary/40 transition-colors">
                  <span className="text-[28px] mb-2 opacity-50">⭐</span>
                  Drop image or click
                </div>
              </div>
              <div>
                <label className="block text-[9px] text-primary mb-2 tracking-[2px]">SOCIALS (OPTIONAL)</label>
                <input
                  type="text"
                  placeholder="Twitter URL"
                  className="w-full p-3 bg-bg-input border border-border-primary rounded-lg text-white text-[13px] font-mono outline-none mb-2 focus:border-primary transition-colors"
                />
                <input
                  type="text"
                  placeholder="Telegram URL"
                  className="w-full p-3 bg-bg-input border border-border-primary rounded-lg text-white text-[13px] font-mono outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {launchStep === 2 && (
          <div>
            <h2 className="font-heading text-lg font-semibold text-white mb-2 flex items-center gap-2.5">
              <span className="text-primary">02</span> SELECT YOUR ENGINE
            </h2>
            <p className="text-xs text-text-muted mb-7">
              All engines = 0% dev extraction. Choose your compound split.
            </p>

            <div className="grid grid-cols-3 gap-3.5 mb-7">
              {Object.entries(engines).map(([key, engine]) => (
                <div
                  key={key}
                  onClick={() => setSelectedEngine(key)}
                  className={`p-[22px] rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedEngine === key
                      ? 'bg-primary/10 border-2 border-primary shadow-[0_0_25px_rgba(136,192,255,0.2)]'
                      : 'bg-bg-input border border-border-primary hover:border-border-accent'
                  }`}
                >
                  <div className="text-[28px] mb-2.5">{engine.icon}</div>
                  <div className={`font-heading text-[13px] font-semibold mb-1.5 ${
                    selectedEngine === key ? 'text-primary' : 'text-white'
                  }`}>
                    {engine.name}
                  </div>
                  <div className="text-[10px] text-text-muted mb-3.5">{engine.desc}</div>
                  <div className="flex gap-1.5">
                    <div className="px-2 py-1.5 bg-primary/10 rounded text-[9px] text-primary border border-[rgba(136,192,255,0.2)]">
                      {engine.lp}% LP
                    </div>
                    <div className="px-2 py-1.5 bg-burn/10 rounded text-[9px] text-burn border border-[rgba(249,115,22,0.2)]">
                      {engine.burn}% BURN
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Gauge */}
            <div className="p-[22px] bg-bg-input rounded-xl border border-[rgba(136,192,255,0.1)] flex items-center gap-7">
              <div
                className="w-[120px] h-[120px] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(136,192,255,0.2)]"
                style={{
                  background: `conic-gradient(#88c0ff 0deg ${engines[selectedEngine].lp * 3.6}deg, #f97316 ${engines[selectedEngine].lp * 3.6}deg 360deg)`
                }}
              >
                <div className="w-[85px] h-[85px] bg-bg-base rounded-full flex flex-col items-center justify-center">
                  <span className="text-[9px] text-text-dim">DEV FEE</span>
                  <span className="font-heading text-2xl font-bold text-success">0%</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-3.5">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[11px] text-text-muted">→ Liquidity Pool</span>
                    <span className="text-[11px] text-primary font-semibold">{engines[selectedEngine].lp}%</span>
                  </div>
                  <div className="h-2 bg-primary/10 rounded overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary-dark rounded shadow-[0_0_10px_rgba(136,192,255,0.5)] transition-[width] duration-300"
                      style={{ width: `${engines[selectedEngine].lp}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[11px] text-text-muted">→ Buyback & Burn</span>
                    <span className="text-[11px] text-burn font-semibold">{engines[selectedEngine].burn}%</span>
                  </div>
                  <div className="h-2 bg-burn/10 rounded overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-burn to-burn-dark rounded transition-[width] duration-300"
                      style={{ width: `${engines[selectedEngine].burn}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {launchStep === 3 && (
          <div>
            <h2 className="font-heading text-lg font-semibold text-white mb-7 flex items-center gap-2.5">
              <span className="text-primary">03</span> READY FOR LAUNCH
            </h2>

            <div className="grid grid-cols-[1.4fr_1fr] gap-5">
              <div className="p-[22px] bg-bg-input rounded-xl border border-[rgba(136,192,255,0.1)]">
                <div className="text-[9px] text-text-dim tracking-[2px] mb-[18px]">VESSEL MANIFEST</div>
                {[
                  { label: 'Token', value: 'STARSHIP (STAR)', color: 'text-white' },
                  { label: 'Engine', value: engines[selectedEngine].name, color: 'text-primary' },
                  { label: 'LP Split', value: `${engines[selectedEngine].lp}%`, color: 'text-primary' },
                  { label: 'Burn Split', value: `${engines[selectedEngine].burn}%`, color: 'text-burn' },
                  { label: 'Dev Extraction', value: '0% LOCKED', color: 'text-success' },
                  { label: 'LP Status', value: 'LOCKED FOREVER', color: 'text-success' },
                ].map((item, i) => (
                  <div key={i} className={`flex justify-between py-2.5 ${i < 5 ? 'border-b border-[rgba(136,192,255,0.08)]' : ''}`}>
                    <span className="text-xs text-text-muted">{item.label}</span>
                    <span className={`text-xs font-semibold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div>
                <div className="glow p-[22px] bg-gradient-to-br from-[rgba(136,192,255,0.12)] to-[rgba(136,192,255,0.04)] border border-border-accent rounded-xl mb-3.5">
                  <div className="text-[9px] text-primary tracking-[2px] mb-3.5">DOCK FEE</div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-text-muted">Launch Fee</span>
                    <span className="text-[13px] text-white">2.00 SOL</span>
                  </div>
                  <div className="flex justify-between mb-3.5">
                    <span className="text-xs text-text-muted">Network</span>
                    <span className="text-[13px] text-white">~0.01 SOL</span>
                  </div>
                  <div className="p-3.5 bg-black/30 rounded-lg flex justify-between items-center">
                    <span className="text-[13px] text-text-muted">Total</span>
                    <span className="font-heading text-[26px] font-bold text-primary">2.01 SOL</span>
                  </div>
                </div>

                <button className="w-full py-[18px] bg-gradient-to-br from-primary to-primary-dark text-bg-base border-none rounded-lg font-heading text-[15px] font-bold cursor-pointer shadow-[0_4px_25px_rgba(136,192,255,0.4)]">
                  🚀 SET SAIL
                </button>
                <p className="text-[9px] text-text-dim text-center mt-2.5">
                  LP locked forever. 0% dev fees. No take-backs.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <div className="flex justify-between mt-9 pt-5 border-t border-[rgba(136,192,255,0.1)]">
          <button
            onClick={() => setLaunchStep(Math.max(1, launchStep - 1))}
            disabled={launchStep === 1}
            className={`px-6 py-3 bg-transparent border border-border-primary rounded-lg text-[11px] ${
              launchStep === 1
                ? 'text-[rgba(136,192,255,0.2)] cursor-not-allowed'
                : 'text-text-muted cursor-pointer hover:border-border-accent'
            }`}
          >
            ← BACK
          </button>
          {launchStep < 3 && (
            <button
              onClick={() => setLaunchStep(launchStep + 1)}
              className="px-6 py-3 bg-gradient-to-br from-primary to-primary-dark text-bg-base border-none rounded-lg text-[11px] font-semibold cursor-pointer"
            >
              CONTINUE →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
