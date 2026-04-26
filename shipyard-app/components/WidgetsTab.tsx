"use client";

export default function WidgetsTab() {
  const widgets = [
    {
      name: 'SEAWORTHY BADGE',
      desc: 'Show buyers your token is verified safe.',
      code: '<script src="shipyard.xyz/badge.js" data-token="STAR" />',
      preview: (
        <div className="inline-flex items-center gap-2.5 px-3.5 py-2.5 bg-primary/10 border border-border-accent rounded-md">
          <div className="w-[22px] h-[22px] bg-gradient-to-br from-primary to-primary-dark rounded flex items-center justify-center text-bg-base text-[11px] font-bold">✓</div>
          <div>
            <div className="text-[10px] text-primary">SEAWORTHY</div>
            <div className="text-[9px] text-text-dim">0% dev • locked LP</div>
          </div>
        </div>
      ),
    },
    {
      name: 'COMPOUND TRACKER',
      desc: 'Live compound stats from on-chain.',
      code: '<iframe src="shipyard.xyz/tracker/STAR" />',
      preview: (
        <div className="flex gap-5">
          <div>
            <div className="text-[9px] text-text-dim mb-0.5">LP ADDED</div>
            <div className="text-base text-primary font-bold">19.6 SOL</div>
          </div>
          <div>
            <div className="text-[9px] text-text-dim mb-0.5">BURNED</div>
            <div className="text-base text-burn font-bold">2.4M</div>
          </div>
        </div>
      ),
    },
    {
      name: 'BURN COUNTER',
      desc: 'Dramatic burn counter for deflation narrative.',
      code: '<iframe src="shipyard.xyz/burn/STAR" />',
      preview: (
        <div className="text-center">
          <div className="text-[9px] text-text-dim mb-1.5">TOKENS INCINERATED</div>
          <div className="font-heading text-[22px] font-bold text-burn">🔥 2,412,847</div>
        </div>
      ),
    },
    {
      name: 'LP DEPTH GAUGE',
      desc: 'Visual gauge showing liquidity growth.',
      code: '<iframe src="shipyard.xyz/gauge/STAR" />',
      preview: (
        <div className="flex justify-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: 'conic-gradient(#88c0ff 0deg 270deg, rgba(136, 192, 255, 0.15) 270deg 360deg)' }}
          >
            <div className="w-[55px] h-[55px] bg-bg-base rounded-full flex flex-col items-center justify-center">
              <span className="text-[13px] text-primary font-bold">$127K</span>
              <span className="text-[8px] text-text-dim">DEPTH</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="animate-in px-10 py-10">
      <div className="mb-9">
        <div className="text-[10px] text-primary tracking-[3px] mb-1.5">THE SHIPYARD</div>
        <h1 className="font-heading text-[30px] font-bold text-white mb-1.5">WIDGETS</h1>
        <p className="text-[13px] text-text-muted">Embeddable components for your token pages.</p>
      </div>

      <div className="grid grid-cols-2 gap-[18px]">
        {widgets.map((widget, i) => (
          <div key={i} className="p-7 bg-bg-glass border border-[rgba(136,192,255,0.1)] rounded-xl">
            <div className="text-[9px] text-primary tracking-[2px] mb-4">{widget.name}</div>
            <div className="p-[18px] bg-bg-input rounded-lg border border-[rgba(136,192,255,0.08)] mb-4">
              {widget.preview}
            </div>
            <p className="text-[11px] text-text-muted mb-3">{widget.desc}</p>
            <div className="p-2.5 bg-bg-input rounded-md text-[9px] text-primary font-mono border border-[rgba(136,192,255,0.1)]">
              {widget.code}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
