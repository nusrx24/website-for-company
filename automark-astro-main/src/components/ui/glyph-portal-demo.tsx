"use client";

import { useEffect, useState } from "react";
import GlyphPortal from "@/components/ui/glyph-portal";

const settings = { word: "LAPCIRCUIT", scrollLength: 2.4, interactive: true, annotations: false };
const family = '"Outfit", "Inter", Arial, sans-serif';

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      data-demo-scroll
      data-slipstream-demo
      tabIndex={0}
      role="region"
      aria-label="LapCircuit. Scroll to step inside."
      style={{
        width: "100%",
        height: "min(720px, 100svh)",
        overflowY: "auto",
        background: "#030508",
        containerType: "inline-size",
        fontFamily: family,
      }}
    >
      <style>{`
        [data-slipstream-demo] [data-gp-caption]{inset:calc(var(--gp-word-bottom,50%) + 82px) 24px auto;justify-content:center;}
        [data-slipstream-demo] [data-gp-hint]{display:none;}
        [data-slipstream-demo] [data-gp-enter]{min-height:46px;padding:0 24px;gap:12px;background:rgba(46,144,255,0.15);border:1px solid rgba(46,144,255,0.4);border-radius:9999px;color:#fff;font-size:13px;font-weight:500;box-shadow:0 0 20px rgba(46,144,255,0.25);transition:all .18s;}
        [data-slipstream-demo] [data-gp-enter]:hover{background:rgba(46,144,255,0.3);box-shadow:0 0 30px rgba(46,144,255,0.45);}
        [data-sublime-header]{position:absolute;inset:clamp(24px,4.5cqw,48px) clamp(24px,5cqw,64px) auto;display:flex;align-items:center;justify-content:space-between;gap:20px;}
        [data-sublime-logo]{font-size:20px;font-weight:700;letter-spacing:-.04em;color:#fff;}
        [data-sublime-category]{font-size:12px;line-height:1.5;color:#94a3b8;letter-spacing:.05em;}
        [data-sublime-eyebrow]{position:absolute;inset:auto 24px calc(100% - var(--gp-word-top,35%) + 32px);margin:0;text-align:center;font-size:14px;font-weight:500;letter-spacing:.02em;color:#2E90FF;}
        [data-sublime-support]{position:absolute;inset:calc(var(--gp-word-bottom,50%) + 32px) 24px auto;margin:0;text-align:center;font-size:15px;font-weight:400;line-height:1.5;color:#94a3b8;max-width:540px;left:50%;transform:translateX(-50%);}
        [data-sublime-scroll]{position:absolute;inset:auto 24px 5%;text-align:center;color:#64748b;font-size:12px;letter-spacing:.02em;}
        [data-slipstream-demo] [data-gp-content]{padding:5.5rem clamp(1.25rem,5cqw,5rem) 6.5rem;font-family:inherit;}
        [data-slipstream-copy]{display:flex;width:min(100%,80rem);margin:auto;flex-direction:column;align-items:flex-start;gap:clamp(2rem,5svh,3.5rem);}
        [data-slipstream-copy] h2{max-width:48rem;margin:0;color:#fff;font-size:clamp(1.75rem,1.1rem + 2.1cqw,2.5rem);font-weight:700;line-height:1.2;letter-spacing:-.02em;}
        [data-slipstream-features]{display:grid;width:100%;grid-template-columns:1fr;gap:1.75rem;}
        [data-slipstream-feature]{border-top:1px solid rgba(46,144,255,.3);padding-top:1.1rem;background:rgba(255,255,255,0.02);padding:1.5rem;border-radius:1rem;}
        [data-slipstream-feature] h3{margin:0;color:#fff;font-size:1.125rem;font-weight:600;}
        [data-slipstream-feature] p{margin:.55rem 0 0;color:#94a3b8;font-size:.9375rem;line-height:1.55;}
        [data-slipstream-no]{display:inline-block;margin-right:.7rem;color:#2E90FF;font:700 .85rem ui-monospace,monospace;letter-spacing:.08em;}
        @container(min-width:768px){[data-slipstream-features]{grid-template-columns:repeat(3,minmax(0,1fr));gap:2rem;}}
      `}</style>
      {mounted ? (
        <GlyphPortal
          word={s.word}
          fontFamily={family}
          fontWeight={900}
          scrollLength={s.scrollLength}
          interactive={s.interactive}
          annotations={s.annotations}
          enterLabel="Step Inside"
          front={
            <>
              <div data-sublime-header>
                <span data-sublime-logo>lapcircuit<span style={{ color: "#2E90FF" }}>.</span></span>
                <span data-sublime-category>Software &bull; Hardware &bull; Business Systems</span>
              </div>
              <p data-sublime-eyebrow>Technology engineered for modern businesses.</p>
              <p data-sublime-support>We build software, POS systems, inventory, billing and cloud solutions for growing businesses in Sri Lanka.</p>
              <span data-sublime-scroll>Scroll to discover &darr;</span>
            </>
          }
        >
          <div data-slipstream-copy>
            <h2>Why businesses choose LapCircuit.</h2>
            <div data-slipstream-features>
              <div data-slipstream-feature>
                <h3><span data-slipstream-no>01</span>Customized</h3>
                <p>Built around the way your business already works, rather than asking you to change your workflow to fit the software.</p>
              </div>
              <div data-slipstream-feature>
                <h3><span data-slipstream-no>02</span>Easy to manage</h3>
                <p>Practical interfaces designed to be understood by the people who use them every day, not only by the person who bought the system.</p>
              </div>
              <div data-slipstream-feature>
                <h3><span data-slipstream-no>03</span>Affordable</h3>
                <p>Transparent starting prices published openly, so you know the range before you contact us.</p>
              </div>
              <div data-slipstream-feature>
                <h3><span data-slipstream-no>04</span>Flexible</h3>
                <p>Offline desktop, a dedicated desktop application, or cloud with desktop and mobile access — whichever suits how you operate.</p>
              </div>
              <div data-slipstream-feature>
                <h3><span data-slipstream-no>05</span>Multi-language</h3>
                <p>Tamil, English and Sinhala, so your staff can work in the language they are most comfortable with.</p>
              </div>
              <div data-slipstream-feature>
                <h3><span data-slipstream-no>06</span>Direct support</h3>
                <p>You talk to the people who built your system. No ticket queue and no call centre in between.</p>
              </div>
            </div>
          </div>
        </GlyphPortal>
      ) : (
        <div role="status" style={{ height: "100%", display: "grid", placeItems: "center", color: "#555", fontSize: 12 }}>
          Loading portal...
        </div>
      )}
    </div>
  );
}
