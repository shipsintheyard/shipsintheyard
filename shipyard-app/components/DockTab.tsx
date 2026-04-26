"use client";

export default function DockTab() {
  return (
    <div className="animate-in px-10 py-10">
      <div className="mb-7">
        <div className="text-[10px] text-primary tracking-[3px] mb-1.5">THE DOCK</div>
        <h1 className="font-heading text-[30px] font-bold text-white">
          STARSHIP <span className="text-text-muted text-lg">$STAR</span>
        </h1>
      </div>

      {/* Badge */}
      <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-primary/10 border border-border-accent rounded-lg mb-7">
        <div className="w-[22px] h-[22px] bg-gradient-to-br from-primary to-primary-dark rounded-[5px] flex items-center justify-center text-bg-base text-xs font-bold">✓</div>
        <span className="text-[11px] text-primary tracking-[1px]">SEAWORTHY CERTIFIED</span>
        <span className="text-[10px] text-text-dim">0% dev • LP locked • auto-compound</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3.5 mb-7">
        {[
          { label: 'TOTAL COMPOUNDED', value: '24.5 SOL', sub: '+3.2 today', color: 'text-primary' },
          { label: 'LP ADDED', value: '19.6 SOL', sub: '80% of fees', color: 'text-primary' },
          { label: 'TOKENS BURNED', value: '2.4M', sub: '~4.9 SOL value', color: 'text-burn' },
          { label: 'LP DEPTH', value: '$127K', sub: '+34% since launch', color: 'text-success' }
        ].map((stat, i) => (
          <div key={i} className="p-[22px] bg-bg-glass border border-[rgba(136,192,255,0.1)] rounded-xl">
            <div className="text-[9px] text-text-dim tracking-[1px] mb-2.5">{stat.label}</div>
            <div className={`font-heading text-[26px] font-bold mb-0.5 ${stat.color}`}>{stat.value}</div>
            <div className="text-[10px] text-text-dim">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Log */}
      <div className="p-[22px] bg-bg-glass border border-[rgba(136,192,255,0.1)] rounded-xl">
        <div className="text-[9px] text-primary tracking-[2px] mb-[18px]">ENGINE LOG</div>
        {[
          { time: '2h ago', amount: '0.85 SOL', lp: '0.68', burn: '0.17', tx: '4xK...9f2' },
          { time: '6h ago', amount: '0.72 SOL', lp: '0.58', burn: '0.14', tx: '7mP...3a1' },
          { time: '14h ago', amount: '0.91 SOL', lp: '0.73', burn: '0.18', tx: '2nR...8k4' },
        ].map((entry, i) => (
          <div key={i} className="flex items-center justify-between p-3.5 bg-[rgba(10,14,18,0.6)] rounded-lg mb-2 border border-[rgba(136,192,255,0.08)]">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-base">⭐</div>
              <div>
                <div className="text-[13px] text-white font-semibold">{entry.amount} compounded</div>
                <div className="text-[10px] text-text-dim">{entry.time}</div>
              </div>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="text-right">
                <div className="text-[10px] text-primary">+{entry.lp} LP</div>
                <div className="text-[10px] text-burn">🔥 {entry.burn}</div>
              </div>
              <span className="text-[9px] text-text-dim">{entry.tx} ↗</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
