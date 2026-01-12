"use client";
import React, { useState } from 'react';

export default function ShipyardPlatform() {
  const [activeTab, setActiveTab] = useState('landing');
  const [launchStep, setLaunchStep] = useState(1);
  const [selectedEngine, setSelectedEngine] = useState('navigator');

  const engines: Record<string, { name: string; lp: number; burn: number; icon: string; desc: string }> = {
    navigator: { name: 'NAVIGATOR', lp: 80, burn: 20, icon: '⭐', desc: 'Maximum LP depth, steady burns' },
    polaris: { name: 'POLARIS', lp: 70, burn: 30, icon: '✦', desc: 'Balanced growth, higher burn rate' },
    supernova: { name: 'SUPERNOVA', lp: 50, burn: 50, icon: '☄️', desc: 'Maximum deflation, 50/50 split' }
  };

  const tabs = [
    { id: 'landing', label: 'Home' },
    { id: 'ship', label: 'Ship It' },
    { id: 'dock', label: 'The Dock' },
    { id: 'widgets', label: 'Widgets' }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0f1419 0%, #1a1f2e 50%, #0f1419 100%)',
      color: '#c9d1d9',
      fontFamily: "'Space Mono', monospace",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Outfit:wght@400;500;600;700;800&display=swap');
        
        * { box-sizing: border-box; }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(136, 192, 255, 0.2); }
          50% { box-shadow: 0 0 40px rgba(136, 192, 255, 0.4); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-in { animation: slideIn 0.5s ease-out forwards; }
        .glow { animation: glow 3s ease-in-out infinite; }
        .float { animation: float 6s ease-in-out infinite; }
      `}</style>

      {/* Stars Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: '2px',
              height: '2px',
              background: '#88c0ff',
              borderRadius: '50%',
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: 0.3
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header style={{
        padding: '16px 40px',
        borderBottom: '1px solid rgba(136, 192, 255, 0.15)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(15, 20, 25, 0.9)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            background: 'linear-gradient(135deg, #88c0ff 0%, #5a9fd4 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            boxShadow: '0 4px 20px rgba(136, 192, 255, 0.3)'
          }}>
            ⛵
          </div>
          <div>
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '20px',
              fontWeight: '700',
              letterSpacing: '1px',
              color: '#fff'
            }}>
              THE SHIPYARD
            </div>
            <div style={{
              fontSize: '9px',
              color: '#88c0ff',
              letterSpacing: '3px'
            }}>
              WE SHIP WIDGETS
            </div>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '6px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 20px',
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, #88c0ff 0%, #5a9fd4 100%)' 
                  : 'transparent',
                color: activeTab === tab.id ? '#0f1419' : '#6e7b8b',
                border: activeTab === tab.id ? 'none' : '1px solid rgba(136, 192, 255, 0.2)',
                borderRadius: '6px',
                fontFamily: "'Space Mono', monospace",
                fontSize: '11px',
                fontWeight: activeTab === tab.id ? '700' : '400',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                letterSpacing: '1px'
              }}
            >
              {tab.label.toUpperCase()}
            </button>
          ))}
        </nav>

        <button style={{
          padding: '12px 24px',
          background: 'transparent',
          color: '#88c0ff',
          border: '1px solid #88c0ff',
          borderRadius: '6px',
          fontFamily: "'Space Mono', monospace",
          fontSize: '11px',
          fontWeight: '600',
          cursor: 'pointer',
          letterSpacing: '1px'
        }}>
          CONNECT WALLET
        </button>
      </header>

      <main>
        {/* LANDING PAGE */}
        {activeTab === 'landing' && (
          <div className="animate-in">
            {/* Hero */}
            <section style={{
              minHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '60px 40px',
              position: 'relative'
            }}>
              {/* Constellation decoration */}
              <svg className="float" style={{ position: 'absolute', top: '15%', right: '15%', opacity: 0.4 }} width="120" height="120" viewBox="0 0 120 120">
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
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'rgba(136, 192, 255, 0.1)',
                border: '1px solid rgba(136, 192, 255, 0.25)',
                borderRadius: '20px',
                marginBottom: '32px',
                fontSize: '11px',
                color: '#88c0ff',
                letterSpacing: '2px'
              }}>
                <span style={{ 
                  width: '6px', 
                  height: '6px', 
                  background: '#88c0ff', 
                  borderRadius: '50%',
                  boxShadow: '0 0 10px #88c0ff'
                }} />
                POWERED BY METEORA
              </div>

              {/* Headline */}
              <h1 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '64px',
                lineHeight: 1.1,
                marginBottom: '24px',
                color: '#fff',
                letterSpacing: '-1px'
              }}>
                BUILD VESSELS<br />
                <span style={{ 
                  background: 'linear-gradient(135deg, #88c0ff 0%, #a8d4ff 50%, #88c0ff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>THAT CAN&apos;T SINK</span>
              </h1>

              <p style={{
                fontSize: '16px',
                color: '#6e7b8b',
                maxWidth: '500px',
                lineHeight: 1.7,
                marginBottom: '40px'
              }}>
                Zero dev extraction. Locked LP forever. Auto-compounding fees.
                <span style={{ color: '#9ab4c8' }}> Navigate with vessels that can&apos;t sink.</span>
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: '16px', marginBottom: '70px' }}>
                <button 
                  onClick={() => setActiveTab('ship')}
                  style={{
                    padding: '16px 36px',
                    background: 'linear-gradient(135deg, #88c0ff 0%, #5a9fd4 100%)',
                    color: '#0f1419',
                    border: 'none',
                    borderRadius: '8px',
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    letterSpacing: '1px',
                    boxShadow: '0 4px 30px rgba(136, 192, 255, 0.35)'
                  }}
                >
                  LAUNCH A VESSEL →
                </button>
                <button style={{
                  padding: '16px 36px',
                  background: 'transparent',
                  color: '#6e7b8b',
                  border: '1px solid rgba(136, 192, 255, 0.25)',
                  borderRadius: '8px',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '12px',
                  cursor: 'pointer'
                }}>
                  VIEW DOCS
                </button>
              </div>

              {/* Stats */}
              <div className="glow" style={{
                display: 'flex',
                gap: '50px',
                padding: '28px 48px',
                background: 'rgba(15, 20, 25, 0.8)',
                border: '1px solid rgba(136, 192, 255, 0.15)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)'
              }}>
                {[
                  { value: '847', label: 'VESSELS SHIPPED', color: '#88c0ff' },
                  { value: '12,450', label: 'SOL COMPOUNDED', color: '#88c0ff' },
                  { value: '∞', label: 'LP LOCKED', color: '#a8d4ff' },
                  { value: '0%', label: 'DEV EXTRACTION', color: '#7ee787' }
                ].map((stat, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '30px',
                      fontWeight: '700',
                      color: stat.color,
                      marginBottom: '4px'
                    }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '9px', color: '#4a5568', letterSpacing: '2px' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* How It Works */}
            <section style={{ padding: '80px 40px', background: 'rgba(20, 27, 35, 0.5)' }}>
              <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                  <div style={{ fontSize: '10px', color: '#88c0ff', letterSpacing: '3px', marginBottom: '12px' }}>
                    NAVIGATION PROTOCOL
                  </div>
                  <h2 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '38px',
                    fontWeight: '700',
                    color: '#fff'
                  }}>
                    SET SAIL IN 3 STEPS
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                  {[
                    { num: '01', title: 'PAY DOCK FEE', desc: '2 SOL to chart your course. Your only cost. Ever.', icon: '⚓' },
                    { num: '02', title: 'SELECT ENGINE', desc: 'Choose your compound strategy. LP vs Burns.', icon: '⭐' },
                    { num: '03', title: 'SET SAIL', desc: 'Launch with locked LP, 0% dev, auto-compound.', icon: '🚀' }
                  ].map((step, i) => (
                    <div key={i} style={{
                      padding: '32px 28px',
                      background: 'rgba(15, 20, 25, 0.8)',
                      border: '1px solid rgba(136, 192, 255, 0.1)',
                      borderRadius: '12px',
                      position: 'relative'
                    }}>
                      <div style={{
                        fontSize: '48px',
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: '800',
                        color: 'rgba(136, 192, 255, 0.08)',
                        position: 'absolute',
                        top: '12px',
                        right: '20px'
                      }}>
                        {step.num}
                      </div>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        background: 'rgba(136, 192, 255, 0.1)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        marginBottom: '20px',
                        border: '1px solid rgba(136, 192, 255, 0.15)'
                      }}>
                        {step.icon}
                      </div>
                      <h3 style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#fff',
                        marginBottom: '10px'
                      }}>
                        {step.title}
                      </h3>
                      <p style={{ fontSize: '13px', color: '#6e7b8b', lineHeight: 1.5 }}>
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Seaworthy Guarantee */}
            <section style={{ padding: '80px 40px' }}>
              <div style={{ maxWidth: '850px', margin: '0 auto' }}>
                <div style={{
                  padding: '50px',
                  borderRadius: '16px',
                  border: '2px solid rgba(136, 192, 255, 0.25)',
                  background: 'linear-gradient(135deg, rgba(136, 192, 255, 0.05) 0%, transparent 100%)',
                  position: 'relative'
                }}>
                  {/* Corner stars */}
                  <div style={{ position: 'absolute', top: '-6px', left: '-6px', color: '#88c0ff', fontSize: '12px' }}>✦</div>
                  <div style={{ position: 'absolute', top: '-6px', right: '-6px', color: '#88c0ff', fontSize: '12px' }}>✦</div>
                  <div style={{ position: 'absolute', bottom: '-6px', left: '-6px', color: '#88c0ff', fontSize: '12px' }}>✦</div>
                  <div style={{ position: 'absolute', bottom: '-6px', right: '-6px', color: '#88c0ff', fontSize: '12px' }}>✦</div>

                  <div style={{ fontSize: '10px', color: '#88c0ff', letterSpacing: '3px', marginBottom: '20px' }}>
                    ✓ SEAWORTHY CERTIFICATION
                  </div>

                  <h2 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#fff',
                    marginBottom: '28px',
                    lineHeight: 1.3
                  }}>
                    EVERY VESSEL FROM THE SHIPYARD<br />
                    COMES WITH THESE LOCKED IN:
                  </h2>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                    {[
                      { check: '0% dev fee extraction', desc: 'Devs profit when you profit' },
                      { check: '100% LP locked forever', desc: 'No rugs. Period.' },
                      { check: 'Immutable metadata', desc: "Can't change name or mint more" },
                      { check: 'Auto-compound forever', desc: 'Fees → LP + Burns, on autopilot' }
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                        <div style={{
                          width: '22px',
                          height: '22px',
                          background: 'linear-gradient(135deg, #88c0ff 0%, #5a9fd4 100%)',
                          borderRadius: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#0f1419',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          flexShrink: 0
                        }}>
                          ✓
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', color: '#fff', fontWeight: '600', marginBottom: '3px' }}>
                            {item.check}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6e7b8b' }}>
                            {item.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '80px 40px', textAlign: 'center' }}>
              <h2 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '42px',
                fontWeight: '700',
                color: '#fff',
                marginBottom: '14px'
              }}>
                READY TO SET SAIL?
              </h2>
              <p style={{ fontSize: '15px', color: '#6e7b8b', marginBottom: '35px' }}>
                2 SOL. Zero extraction. Infinite LP. Navigate the stars.
              </p>
              <button
                onClick={() => setActiveTab('ship')}
                style={{
                  padding: '18px 50px',
                  background: 'linear-gradient(135deg, #88c0ff 0%, #5a9fd4 100%)',
                  color: '#0f1419',
                  border: 'none',
                  borderRadius: '8px',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 4px 35px rgba(136, 192, 255, 0.4)'
                }}
              >
                LAUNCH THE SHIPYARD →
              </button>
            </section>
          </div>
        )}

        {/* SHIP IT - Launch Flow */}
        {activeTab === 'ship' && (
          <div className="animate-in" style={{ padding: '40px', maxWidth: '950px', margin: '0 auto' }}>
            <div style={{ marginBottom: '35px' }}>
              <div style={{ fontSize: '10px', color: '#88c0ff', letterSpacing: '3px', marginBottom: '6px' }}>
                THE SHIPYARD
              </div>
              <h1 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '32px',
                fontWeight: '700',
                color: '#fff'
              }}>
                LAUNCH A VESSEL
              </h1>
            </div>

            {/* Progress */}
            <div style={{ display: 'flex', marginBottom: '35px', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                top: '18px',
                left: '70px',
                right: '70px',
                height: '2px',
                background: 'rgba(136, 192, 255, 0.15)'
              }}>
                <div style={{
                  width: `${((launchStep - 1) / 2) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #88c0ff, #5a9fd4)',
                  transition: 'width 0.3s ease',
                  boxShadow: '0 0 10px rgba(136, 192, 255, 0.5)'
                }} />
              </div>

              {['VESSEL INFO', 'ENGINE SELECT', 'LAUNCH'].map((step, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                  <div
                    onClick={() => setLaunchStep(i + 1)}
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: launchStep > i 
                        ? 'linear-gradient(135deg, #88c0ff, #5a9fd4)' 
                        : launchStep === i + 1 ? 'rgba(15, 20, 25, 0.9)' : 'rgba(15, 20, 25, 0.5)',
                      border: launchStep === i + 1 ? '2px solid #88c0ff' : '1px solid rgba(136, 192, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: launchStep > i ? '#0f1419' : '#6e7b8b',
                      fontWeight: '700',
                      fontSize: '13px',
                      cursor: 'pointer',
                      boxShadow: launchStep === i + 1 ? '0 0 20px rgba(136, 192, 255, 0.3)' : 'none'
                    }}
                  >
                    {launchStep > i ? '✓' : i + 1}
                  </div>
                  <span style={{
                    marginTop: '10px',
                    fontSize: '9px',
                    color: launchStep === i + 1 ? '#88c0ff' : '#4a5568',
                    letterSpacing: '1px'
                  }}>
                    {step}
                  </span>
                </div>
              ))}
            </div>

            {/* Form */}
            <div style={{
              borderRadius: '16px',
              padding: '35px',
              background: 'rgba(15, 20, 25, 0.8)',
              border: '1px solid rgba(136, 192, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              minHeight: '450px'
            }}>
              {/* Step 1 */}
              {launchStep === 1 && (
                <div>
                  <h2 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#fff',
                    marginBottom: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span style={{ color: '#88c0ff' }}>01</span> VESSEL INFORMATION
                  </h2>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '9px', color: '#88c0ff', marginBottom: '8px', letterSpacing: '2px' }}>
                        TOKEN NAME
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. STARSHIP"
                        style={{
                          width: '100%',
                          padding: '14px',
                          background: 'rgba(10, 14, 18, 0.8)',
                          border: '1px solid rgba(136, 192, 255, 0.15)',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '14px',
                          fontFamily: "'Space Mono', monospace",
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '9px', color: '#88c0ff', marginBottom: '8px', letterSpacing: '2px' }}>
                        SYMBOL
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. STAR"
                        style={{
                          width: '100%',
                          padding: '14px',
                          background: 'rgba(10, 14, 18, 0.8)',
                          border: '1px solid rgba(136, 192, 255, 0.15)',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '14px',
                          fontFamily: "'Space Mono', monospace",
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', fontSize: '9px', color: '#88c0ff', marginBottom: '8px', letterSpacing: '2px' }}>
                        DESCRIPTION
                      </label>
                      <textarea
                        placeholder="Chart your vessel's journey..."
                        rows={3}
                        style={{
                          width: '100%',
                          padding: '14px',
                          background: 'rgba(10, 14, 18, 0.8)',
                          border: '1px solid rgba(136, 192, 255, 0.15)',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '14px',
                          fontFamily: "'Space Mono', monospace",
                          outline: 'none',
                          resize: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '9px', color: '#88c0ff', marginBottom: '8px', letterSpacing: '2px' }}>
                        VESSEL IMAGE
                      </label>
                      <div style={{
                        height: '120px',
                        background: 'rgba(10, 14, 18, 0.8)',
                        border: '2px dashed rgba(136, 192, 255, 0.2)',
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#4a5568',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}>
                        <span style={{ fontSize: '28px', marginBottom: '8px', opacity: 0.5 }}>⭐</span>
                        Drop image or click
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '9px', color: '#88c0ff', marginBottom: '8px', letterSpacing: '2px' }}>
                        SOCIALS (OPTIONAL)
                      </label>
                      <input type="text" placeholder="Twitter URL" style={{
                        width: '100%', padding: '12px', background: 'rgba(10, 14, 18, 0.8)',
                        border: '1px solid rgba(136, 192, 255, 0.15)', borderRadius: '8px',
                        color: '#fff', fontSize: '13px', fontFamily: "'Space Mono', monospace",
                        outline: 'none', marginBottom: '8px'
                      }} />
                      <input type="text" placeholder="Telegram URL" style={{
                        width: '100%', padding: '12px', background: 'rgba(10, 14, 18, 0.8)',
                        border: '1px solid rgba(136, 192, 255, 0.15)', borderRadius: '8px',
                        color: '#fff', fontSize: '13px', fontFamily: "'Space Mono', monospace",
                        outline: 'none'
                      }} />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {launchStep === 2 && (
                <div>
                  <h2 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#fff',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span style={{ color: '#88c0ff' }}>02</span> SELECT YOUR ENGINE
                  </h2>
                  <p style={{ fontSize: '12px', color: '#6e7b8b', marginBottom: '28px' }}>
                    All engines = 0% dev extraction. Choose your compound split.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '28px' }}>
                    {Object.entries(engines).map(([key, engine]) => (
                      <div
                        key={key}
                        onClick={() => setSelectedEngine(key)}
                        style={{
                          padding: '22px',
                          background: selectedEngine === key ? 'rgba(136, 192, 255, 0.1)' : 'rgba(10, 14, 18, 0.8)',
                          border: selectedEngine === key ? '2px solid #88c0ff' : '1px solid rgba(136, 192, 255, 0.15)',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: selectedEngine === key ? '0 0 25px rgba(136, 192, 255, 0.2)' : 'none'
                        }}
                      >
                        <div style={{ fontSize: '28px', marginBottom: '10px' }}>{engine.icon}</div>
                        <div style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: '13px',
                          fontWeight: '600',
                          color: selectedEngine === key ? '#88c0ff' : '#fff',
                          marginBottom: '6px'
                        }}>
                          {engine.name}
                        </div>
                        <div style={{ fontSize: '10px', color: '#6e7b8b', marginBottom: '14px' }}>
                          {engine.desc}
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <div style={{
                            padding: '5px 8px',
                            background: 'rgba(136, 192, 255, 0.1)',
                            borderRadius: '4px',
                            fontSize: '9px',
                            color: '#88c0ff',
                            border: '1px solid rgba(136, 192, 255, 0.2)'
                          }}>
                            {engine.lp}% LP
                          </div>
                          <div style={{
                            padding: '5px 8px',
                            background: 'rgba(249, 115, 22, 0.1)',
                            borderRadius: '4px',
                            fontSize: '9px',
                            color: '#f97316',
                            border: '1px solid rgba(249, 115, 22, 0.2)'
                          }}>
                            {engine.burn}% BURN
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Gauge */}
                  <div style={{
                    padding: '22px',
                    background: 'rgba(10, 14, 18, 0.8)',
                    borderRadius: '12px',
                    border: '1px solid rgba(136, 192, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '28px'
                  }}>
                    <div style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      background: `conic-gradient(#88c0ff 0deg ${engines[selectedEngine].lp * 3.6}deg, #f97316 ${engines[selectedEngine].lp * 3.6}deg 360deg)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 30px rgba(136, 192, 255, 0.2)'
                    }}>
                      <div style={{
                        width: '85px',
                        height: '85px',
                        background: '#0f1419',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column'
                      }}>
                        <span style={{ fontSize: '9px', color: '#4a5568' }}>DEV FEE</span>
                        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '24px', fontWeight: '700', color: '#7ee787' }}>0%</span>
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                          <span style={{ fontSize: '11px', color: '#6e7b8b' }}>→ Liquidity Pool</span>
                          <span style={{ fontSize: '11px', color: '#88c0ff', fontWeight: '600' }}>{engines[selectedEngine].lp}%</span>
                        </div>
                        <div style={{ height: '8px', background: 'rgba(136, 192, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${engines[selectedEngine].lp}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #88c0ff, #5a9fd4)',
                            borderRadius: '4px',
                            boxShadow: '0 0 10px rgba(136, 192, 255, 0.5)'
                          }} />
                        </div>
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                          <span style={{ fontSize: '11px', color: '#6e7b8b' }}>→ Buyback & Burn</span>
                          <span style={{ fontSize: '11px', color: '#f97316', fontWeight: '600' }}>{engines[selectedEngine].burn}%</span>
                        </div>
                        <div style={{ height: '8px', background: 'rgba(249, 115, 22, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${engines[selectedEngine].burn}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #f97316, #ea580c)',
                            borderRadius: '4px'
                          }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {launchStep === 3 && (
                <div>
                  <h2 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#fff',
                    marginBottom: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span style={{ color: '#88c0ff' }}>03</span> READY FOR LAUNCH
                  </h2>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
                    <div style={{
                      padding: '22px',
                      background: 'rgba(10, 14, 18, 0.8)',
                      borderRadius: '12px',
                      border: '1px solid rgba(136, 192, 255, 0.1)'
                    }}>
                      <div style={{ fontSize: '9px', color: '#4a5568', letterSpacing: '2px', marginBottom: '18px' }}>
                        VESSEL MANIFEST
                      </div>
                      {[
                        { label: 'Token', value: 'STARSHIP (STAR)', color: '#fff' },
                        { label: 'Engine', value: engines[selectedEngine].name, color: '#88c0ff' },
                        { label: 'LP Split', value: `${engines[selectedEngine].lp}%`, color: '#88c0ff' },
                        { label: 'Burn Split', value: `${engines[selectedEngine].burn}%`, color: '#f97316' },
                        { label: 'Dev Extraction', value: '0% LOCKED', color: '#7ee787' },
                        { label: 'LP Status', value: 'LOCKED FOREVER', color: '#7ee787' },
                      ].map((item, i) => (
                        <div key={i} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '10px 0',
                          borderBottom: i < 5 ? '1px solid rgba(136, 192, 255, 0.08)' : 'none'
                        }}>
                          <span style={{ fontSize: '12px', color: '#6e7b8b' }}>{item.label}</span>
                          <span style={{ fontSize: '12px', color: item.color, fontWeight: '600' }}>{item.value}</span>
                        </div>
                      ))}
                    </div>

                    <div>
                      <div className="glow" style={{
                        padding: '22px',
                        background: 'linear-gradient(135deg, rgba(136, 192, 255, 0.12) 0%, rgba(136, 192, 255, 0.04) 100%)',
                        border: '1px solid rgba(136, 192, 255, 0.25)',
                        borderRadius: '12px',
                        marginBottom: '14px'
                      }}>
                        <div style={{ fontSize: '9px', color: '#88c0ff', letterSpacing: '2px', marginBottom: '14px' }}>
                          DOCK FEE
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '12px', color: '#6e7b8b' }}>Launch Fee</span>
                          <span style={{ fontSize: '13px', color: '#fff' }}>2.00 SOL</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                          <span style={{ fontSize: '12px', color: '#6e7b8b' }}>Network</span>
                          <span style={{ fontSize: '13px', color: '#fff' }}>~0.01 SOL</span>
                        </div>
                        <div style={{
                          padding: '14px',
                          background: 'rgba(0,0,0,0.3)',
                          borderRadius: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span style={{ fontSize: '13px', color: '#6e7b8b' }}>Total</span>
                          <span style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: '26px',
                            fontWeight: '700',
                            color: '#88c0ff'
                          }}>
                            2.01 SOL
                          </span>
                        </div>
                      </div>

                      <button style={{
                        width: '100%',
                        padding: '18px',
                        background: 'linear-gradient(135deg, #88c0ff 0%, #5a9fd4 100%)',
                        color: '#0f1419',
                        border: 'none',
                        borderRadius: '8px',
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '15px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 4px 25px rgba(136, 192, 255, 0.4)'
                      }}>
                        🚀 SET SAIL
                      </button>
                      <p style={{ fontSize: '9px', color: '#4a5568', textAlign: 'center', marginTop: '10px' }}>
                        LP locked forever. 0% dev fees. No take-backs.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Nav */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '35px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(136, 192, 255, 0.1)'
              }}>
                <button
                  onClick={() => setLaunchStep(Math.max(1, launchStep - 1))}
                  disabled={launchStep === 1}
                  style={{
                    padding: '12px 24px',
                    background: 'transparent',
                    color: launchStep === 1 ? 'rgba(136, 192, 255, 0.2)' : '#6e7b8b',
                    border: '1px solid rgba(136, 192, 255, 0.15)',
                    borderRadius: '8px',
                    fontSize: '11px',
                    cursor: launchStep === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  ← BACK
                </button>
                {launchStep < 3 && (
                  <button
                    onClick={() => setLaunchStep(launchStep + 1)}
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #88c0ff 0%, #5a9fd4 100%)',
                      color: '#0f1419',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    CONTINUE →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DOCK */}
        {activeTab === 'dock' && (
          <div className="animate-in" style={{ padding: '40px' }}>
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '10px', color: '#88c0ff', letterSpacing: '3px', marginBottom: '6px' }}>THE DOCK</div>
              <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '30px', fontWeight: '700', color: '#fff' }}>
                STARSHIP <span style={{ color: '#6e7b8b', fontSize: '18px' }}>$STAR</span>
              </h1>
            </div>

            {/* Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 16px',
              background: 'rgba(136, 192, 255, 0.1)',
              border: '1px solid rgba(136, 192, 255, 0.25)',
              borderRadius: '8px',
              marginBottom: '28px'
            }}>
              <div style={{
                width: '22px',
                height: '22px',
                background: 'linear-gradient(135deg, #88c0ff, #5a9fd4)',
                borderRadius: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0f1419',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>✓</div>
              <span style={{ fontSize: '11px', color: '#88c0ff', letterSpacing: '1px' }}>SEAWORTHY CERTIFIED</span>
              <span style={{ fontSize: '10px', color: '#4a5568' }}>0% dev • LP locked • auto-compound</span>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
              {[
                { label: 'TOTAL COMPOUNDED', value: '24.5 SOL', sub: '+3.2 today', color: '#88c0ff' },
                { label: 'LP ADDED', value: '19.6 SOL', sub: '80% of fees', color: '#88c0ff' },
                { label: 'TOKENS BURNED', value: '2.4M', sub: '~4.9 SOL value', color: '#f97316' },
                { label: 'LP DEPTH', value: '$127K', sub: '+34% since launch', color: '#7ee787' }
              ].map((stat, i) => (
                <div key={i} style={{
                  padding: '22px',
                  background: 'rgba(15, 20, 25, 0.8)',
                  border: '1px solid rgba(136, 192, 255, 0.1)',
                  borderRadius: '12px'
                }}>
                  <div style={{ fontSize: '9px', color: '#4a5568', letterSpacing: '1px', marginBottom: '10px' }}>{stat.label}</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '26px', fontWeight: '700', color: stat.color, marginBottom: '3px' }}>{stat.value}</div>
                  <div style={{ fontSize: '10px', color: '#4a5568' }}>{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Log */}
            <div style={{
              padding: '22px',
              background: 'rgba(15, 20, 25, 0.8)',
              border: '1px solid rgba(136, 192, 255, 0.1)',
              borderRadius: '12px'
            }}>
              <div style={{ fontSize: '9px', color: '#88c0ff', letterSpacing: '2px', marginBottom: '18px' }}>ENGINE LOG</div>
              {[
                { time: '2h ago', amount: '0.85 SOL', lp: '0.68', burn: '0.17', tx: '4xK...9f2' },
                { time: '6h ago', amount: '0.72 SOL', lp: '0.58', burn: '0.14', tx: '7mP...3a1' },
                { time: '14h ago', amount: '0.91 SOL', lp: '0.73', burn: '0.18', tx: '2nR...8k4' },
              ].map((entry, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px',
                  background: 'rgba(10, 14, 18, 0.6)',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  border: '1px solid rgba(136, 192, 255, 0.08)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      background: 'rgba(136, 192, 255, 0.1)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px'
                    }}>⭐</div>
                    <div>
                      <div style={{ fontSize: '13px', color: '#fff', fontWeight: '600' }}>{entry.amount} compounded</div>
                      <div style={{ fontSize: '10px', color: '#4a5568' }}>{entry.time}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '10px', color: '#88c0ff' }}>+{entry.lp} LP</div>
                      <div style={{ fontSize: '10px', color: '#f97316' }}>🔥 {entry.burn}</div>
                    </div>
                    <span style={{ fontSize: '9px', color: '#4a5568' }}>{entry.tx} ↗</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WIDGETS */}
        {activeTab === 'widgets' && (
          <div className="animate-in" style={{ padding: '40px' }}>
            <div style={{ marginBottom: '35px' }}>
              <div style={{ fontSize: '10px', color: '#88c0ff', letterSpacing: '3px', marginBottom: '6px' }}>THE SHIPYARD</div>
              <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '30px', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>WIDGETS</h1>
              <p style={{ fontSize: '13px', color: '#6e7b8b' }}>Embeddable components for your token pages.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px' }}>
              {[
                { name: 'SEAWORTHY BADGE', desc: 'Show buyers your token is verified safe.', preview: (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'rgba(136, 192, 255, 0.1)', border: '1px solid rgba(136, 192, 255, 0.25)', borderRadius: '6px' }}>
                    <div style={{ width: '22px', height: '22px', background: 'linear-gradient(135deg, #88c0ff, #5a9fd4)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f1419', fontSize: '11px', fontWeight: 'bold' }}>✓</div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#88c0ff' }}>SEAWORTHY</div>
                      <div style={{ fontSize: '9px', color: '#4a5568' }}>0% dev • locked LP</div>
                    </div>
                  </div>
                ), code: '<script src="shipyard.xyz/badge.js" data-token="STAR" />' },
                { name: 'COMPOUND TRACKER', desc: 'Live compound stats from on-chain.', preview: (
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <div><div style={{ fontSize: '9px', color: '#4a5568', marginBottom: '3px' }}>LP ADDED</div><div style={{ fontSize: '16px', color: '#88c0ff', fontWeight: '700' }}>19.6 SOL</div></div>
                    <div><div style={{ fontSize: '9px', color: '#4a5568', marginBottom: '3px' }}>BURNED</div><div style={{ fontSize: '16px', color: '#f97316', fontWeight: '700' }}>2.4M</div></div>
                  </div>
                ), code: '<iframe src="shipyard.xyz/tracker/STAR" />' },
                { name: 'BURN COUNTER', desc: 'Dramatic burn counter for deflation narrative.', preview: (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', color: '#4a5568', marginBottom: '5px' }}>TOKENS INCINERATED</div>
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '22px', fontWeight: '700', color: '#f97316' }}>🔥 2,412,847</div>
                  </div>
                ), code: '<iframe src="shipyard.xyz/burn/STAR" />' },
                { name: 'LP DEPTH GAUGE', desc: 'Visual gauge showing liquidity growth.', preview: (
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'conic-gradient(#88c0ff 0deg 270deg, rgba(136, 192, 255, 0.15) 270deg 360deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '55px', height: '55px', background: '#0f1419', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <span style={{ fontSize: '13px', color: '#88c0ff', fontWeight: '700' }}>$127K</span>
                        <span style={{ fontSize: '8px', color: '#4a5568' }}>DEPTH</span>
                      </div>
                    </div>
                  </div>
                ), code: '<iframe src="shipyard.xyz/gauge/STAR" />' }
              ].map((widget, i) => (
                <div key={i} style={{
                  padding: '28px',
                  background: 'rgba(15, 20, 25, 0.8)',
                  border: '1px solid rgba(136, 192, 255, 0.1)',
                  borderRadius: '12px'
                }}>
                  <div style={{ fontSize: '9px', color: '#88c0ff', letterSpacing: '2px', marginBottom: '16px' }}>{widget.name}</div>
                  <div style={{
                    padding: '18px',
                    background: 'rgba(10, 14, 18, 0.8)',
                    borderRadius: '8px',
                    border: '1px solid rgba(136, 192, 255, 0.08)',
                    marginBottom: '16px'
                  }}>
                    {widget.preview}
                  </div>
                  <p style={{ fontSize: '11px', color: '#6e7b8b', marginBottom: '12px' }}>{widget.desc}</p>
                  <div style={{
                    padding: '10px',
                    background: 'rgba(10, 14, 18, 0.8)',
                    borderRadius: '6px',
                    fontSize: '9px',
                    color: '#88c0ff',
                    fontFamily: "'Space Mono', monospace",
                    border: '1px solid rgba(136, 192, 255, 0.1)'
                  }}>
                    {widget.code}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        padding: '35px 40px',
        borderTop: '1px solid rgba(136, 192, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '11px', color: '#4a5568' }}>© 2026 THE SHIPYARD. We ship widgets.</div>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['Twitter', 'Docs', 'GitHub'].map(link => (
            <a key={link} href="#" style={{ fontSize: '11px', color: '#6e7b8b', textDecoration: 'none' }}>{link}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
