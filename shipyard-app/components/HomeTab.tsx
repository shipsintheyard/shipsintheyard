"use client";

interface HomeTabProps {
  onNavigate: (tab: string) => void;
}

export default function HomeTab({ onNavigate }: HomeTabProps) {
  return (
    <div className="animate-in">
      {/* Hero */}
      <section className="min-h-[85vh] flex flex-col justify-center items-center text-center px-10 py-15 relative">
        {/* Constellation decoration */}
        <svg className="float absolute top-[15%] right-[15%] opacity-40" width="120" height="120" viewBox="0 0 120 120">
          <line x1="60" y1="10" x2="100" y2="50" stroke="#88c0ff" strokeWidth="1" opacity="0.5"/>
          <line x1="100" y1="50" x2="80" y2="100" stroke="#88c0ff" strokeWidth="1" opacity="0.5"/>
          <line x1="80" y1="100" x2="20" y2="80" stroke="#88c0ff" strokeWidth="1" opacity="0.5"/>
          <line x1="20" y1="80" x2="60" y2="10" stroke="#88c0ff" strokeWidth="1" opacity="0.5"/>
          <circle cx="60" cy="10" r="3" fill="#88c0ff"/>
          <circle cx="100" cy="50" r="3" fill="#88c0ff"/>
          <circle cx="80" cy="100" r="3" fill="#88c0ff"/>
          <circle cx="20" cy="80" r="3" fill="#88c0ff"/>
          <circle cx="60" cy="55" r="4" fill="#fff"/>
        </svg>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-border-accent rounded-[20px] mb-8 text-[11px] text-primary tracking-[2px]">
          <span className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_#88c0ff]" />
          POWERED BY METEORA
        </div>

        {/* Headline */}
        <h1 className="font-heading text-[64px] leading-[1.1] mb-6 text-white tracking-[-1px]">
          BUILD VESSELS<br />
          <span className="bg-gradient-to-br from-primary via-[#a8d4ff] to-primary bg-clip-text text-transparent">
            THAT CAN&apos;T SINK
          </span>
        </h1>

        <p className="text-base text-text-muted max-w-[500px] leading-[1.7] mb-10">
          Zero dev extraction. Locked LP forever. Auto-compounding fees.
          <span className="text-text-subtle"> Navigate with vessels that can&apos;t sink.</span>
        </p>

        {/* CTAs */}
        <div className="flex gap-4 mb-[70px]">
          <button
            onClick={() => onNavigate('ship')}
            className="px-9 py-4 bg-gradient-to-br from-primary to-primary-dark text-bg-base border-none rounded-lg font-heading text-sm font-bold cursor-pointer tracking-[1px] shadow-[0_4px_30px_rgba(136,192,255,0.3)]"
          >
            LAUNCH A VESSEL →
          </button>
          <button className="px-9 py-4 bg-transparent text-text-muted border border-border-primary rounded-lg font-mono text-xs cursor-pointer">
            VIEW DOCS
          </button>
        </div>

        {/* Stats */}
        <div className="glow flex gap-[50px] px-12 py-7 bg-bg-glass border border-border-primary rounded-xl backdrop-blur-[10px]">
          {[
            { value: '847', label: 'VESSELS SHIPPED', color: 'text-primary' },
            { value: '12,450', label: 'SOL COMPOUNDED', color: 'text-primary' },
            { value: '∞', label: 'LP LOCKED', color: 'text-[#a8d4ff]' },
            { value: '0%', label: 'DEV EXTRACTION', color: 'text-success' }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className={`font-heading text-[30px] font-bold mb-1 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-[9px] text-text-dim tracking-[2px]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="px-10 py-20 bg-[rgba(20,27,35,0.5)]">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-[50px]">
            <div className="text-[10px] text-primary tracking-[3px] mb-3">
              NAVIGATION PROTOCOL
            </div>
            <h2 className="font-heading text-[38px] font-bold text-white">
              SET SAIL IN 3 STEPS
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {[
              { num: '01', title: 'PAY DOCK FEE', desc: '2 SOL to chart your course. Your only cost. Ever.', icon: '⚓' },
              { num: '02', title: 'SELECT ENGINE', desc: 'Choose your compound strategy. LP vs Burns.', icon: '⭐' },
              { num: '03', title: 'SET SAIL', desc: 'Launch with locked LP, 0% dev, auto-compound.', icon: '🚀' }
            ].map((step, i) => (
              <div key={i} className="p-8 bg-bg-glass border border-[rgba(136,192,255,0.1)] rounded-xl relative">
                <div className="text-[48px] font-heading font-extrabold text-[rgba(136,192,255,0.08)] absolute top-3 right-5">
                  {step.num}
                </div>
                <div className="w-[50px] h-[50px] bg-primary/10 rounded-[10px] flex items-center justify-center text-2xl mb-5 border border-border-primary">
                  {step.icon}
                </div>
                <h3 className="font-heading text-base font-semibold text-white mb-2.5">
                  {step.title}
                </h3>
                <p className="text-[13px] text-text-muted leading-[1.5]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seaworthy Guarantee */}
      <section className="px-10 py-20">
        <div className="max-w-[850px] mx-auto">
          <div className="p-[50px] rounded-2xl border-2 border-border-accent bg-gradient-to-br from-[rgba(136,192,255,0.05)] to-transparent relative">
            {/* Corner stars */}
            <div className="absolute -top-1.5 -left-1.5 text-primary text-xs">✦</div>
            <div className="absolute -top-1.5 -right-1.5 text-primary text-xs">✦</div>
            <div className="absolute -bottom-1.5 -left-1.5 text-primary text-xs">✦</div>
            <div className="absolute -bottom-1.5 -right-1.5 text-primary text-xs">✦</div>

            <div className="text-[10px] text-primary tracking-[3px] mb-5">
              ✓ SEAWORTHY CERTIFICATION
            </div>

            <h2 className="font-heading text-[28px] font-bold text-white mb-7 leading-[1.3]">
              EVERY VESSEL FROM THE SHIPYARD<br />
              COMES WITH THESE LOCKED IN:
            </h2>

            <div className="grid grid-cols-2 gap-[18px]">
              {[
                { check: '0% dev fee extraction', desc: 'Devs profit when you profit' },
                { check: '100% LP locked forever', desc: 'No rugs. Period.' },
                { check: 'Immutable metadata', desc: "Can't change name or mint more" },
                { check: 'Auto-compound forever', desc: 'Fees → LP + Burns, on autopilot' }
              ].map((item, i) => (
                <div key={i} className="flex gap-3.5 items-start">
                  <div className="w-[22px] h-[22px] bg-gradient-to-br from-primary to-primary-dark rounded-[5px] flex items-center justify-center text-bg-base text-xs font-bold shrink-0">
                    ✓
                  </div>
                  <div>
                    <div className="text-sm text-white font-semibold mb-0.5">{item.check}</div>
                    <div className="text-xs text-text-muted">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-10 py-20 text-center">
        <h2 className="font-heading text-[42px] font-bold text-white mb-3.5">
          READY TO SET SAIL?
        </h2>
        <p className="text-[15px] text-text-muted mb-9">
          2 SOL. Zero extraction. Infinite LP. Navigate the stars.
        </p>
        <button
          onClick={() => onNavigate('ship')}
          className="px-[50px] py-[18px] bg-gradient-to-br from-primary to-primary-dark text-bg-base border-none rounded-lg font-heading text-[15px] font-bold cursor-pointer shadow-[0_4px_35px_rgba(136,192,255,0.4)]"
        >
          LAUNCH THE SHIPYARD →
        </button>
      </section>
    </div>
  );
}
