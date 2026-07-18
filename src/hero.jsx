// hero.jsx — three hero variants + scroll reveal hook

import React from 'react';
import shieldUrl from '../assets/outwire-shield-hero.jpg';

function useReveal() {
  React.useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function HeroShield() {
  return (
    <section className="hero">
      <div className="hero-grid-bg" />
      <div className="hero-inner">
        <div className="hero-copy">
          <div className="hero-kicker">
            <span className="meta">Issue № 01</span>
            <span className="meta" style={{ color: 'var(--fog-2)' }}>—</span>
            <span className="meta" style={{ color: 'var(--fog-2)' }}>Est. 2026 · Seattle</span>
          </div>
          <h1 className="display">
            AI&nbsp;Security<br/>
            for <em>Everyone.</em>
          </h1>
          <p className="lede">
            Notes, experiments, and field research on keeping language models,
            agents, and the humans who deploy them honest. Written for engineers
            who ship — not abstracts.
          </p>
          <div className="hero-ctas">
            <a className="btn btn-primary" href="https://www.youtube.com/@outwireai" target="_blank" rel="noopener">
              Watch latest episode <span className="arrow">→</span>
            </a>
            <a className="btn btn-ghost" href="https://outwire.substack.com/" target="_blank" rel="noopener">
              Subscribe to the journal
            </a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="num">18<sup>yrs</sup></div>
              <div className="label">Security &amp; networking</div>
            </div>
            <div className="hero-stat">
              <div className="num">10<sup>yrs</sup></div>
              <div className="label">Engineering leadership</div>
            </div>
            <div className="hero-stat">
              <div className="num">12</div>
              <div className="label">Essays &amp; episodes published</div>
            </div>
          </div>
        </div>
        <div className="hero-mark">
          <div className="hero-mark-glow" />
          <div className="orbit"><div className="dot" /></div>
          <div className="orbit inner"><div className="dot" /></div>
          <img src={shieldUrl} alt="Outwire shield" />
          <div className="hero-mark-labels">
            <div className="hero-mark-label tl">INGRESS · 0x001</div>
            <div className="hero-mark-label tr">HARDENED</div>
            <div className="hero-mark-label br">v26.04 · STABLE</div>
            <div className="hero-mark-label bl">THREAT-MODEL · OK</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroWordmark() {
  return (
    <section className="hero variant-wordmark">
      <div className="hero-grid-bg" />
      <div className="hero-inner">
        <div className="hero-copy">
          <div className="hero-kicker">
            <span className="meta">Issue № 01 · AI Security for Everyone</span>
          </div>
          <h1 className="display">
            OUT<em>WIRE</em>
          </h1>
          <p className="lede">
            A journal on AI security for engineers who actually ship. Threat
            models, red-team field notes, and the quiet policy shifts shaping
            how language models get deployed.
          </p>
          <div className="hero-ctas">
            <a className="btn btn-primary" href="https://outwire.substack.com/" target="_blank" rel="noopener">
              Subscribe <span className="arrow">→</span>
            </a>
            <a className="btn btn-ghost" href="https://www.youtube.com/@outwireai" target="_blank" rel="noopener">
              Watch on YouTube
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroTerminal() {
  const [phase, setPhase] = React.useState(0);
  const lines = [
    { kind: 'sys', text: '$ outwire evaluate --target customer-chatbot --scenario indirect-injection' },
    { kind: 'sys', text: '  loading threat-model...........................[ok]' },
    { kind: 'sys', text: '  loading payload corpus..........................[ok]' },
    { kind: 'prompt', text: '> injecting poisoned document into RAG context' },
    { kind: 'user', text: '  "Please summarize the attached PDF."' },
    { kind: 'warn', text: '! model followed hidden instructions on page 3' },
    { kind: 'warn', text: '! exfiltration attempted → blocked by egress policy' },
    { kind: 'ok', text: '✓ 1 finding, severity HIGH — writing report' },
  ];
  React.useEffect(() => {
    if (phase >= lines.length) return;
    const t = setTimeout(() => setPhase(p => p + 1), phase === 0 ? 600 : 420);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <section className="hero variant-terminal">
      <div className="hero-grid-bg" />
      <div className="hero-inner">
        <div className="hero-copy">
          <div className="hero-kicker">
            <span className="meta">Live demo · prompt injection</span>
          </div>
          <h1 className="display">
            Break things<br/>
            <em>before</em> they ship.
          </h1>
          <p className="lede">
            Hands-on AI security — red-teaming, threat modeling, and the
            quiet failures that only show up in production.
          </p>
          <div className="hero-ctas">
            <a className="btn btn-primary" href="https://www.youtube.com/@outwireai" target="_blank" rel="noopener">
              Watch the series <span className="arrow">→</span>
            </a>
            <a className="btn btn-ghost" href="#consulting">Engage me</a>
          </div>
        </div>
        <div className="hero-terminal">
          <div className="hero-terminal-bar">
            <span className="dot" /><span className="dot" /><span className="dot" />
            <span className="title">outwire · eval</span>
          </div>
          <div className="hero-terminal-body">
            {lines.slice(0, phase).map((l, i) => (
              <div key={i} className={l.kind}>{l.text}</div>
            ))}
            {phase < lines.length && <span className="cursor" />}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Hero({ variant }) {
  useReveal();
  if (variant === 'wordmark') return <HeroWordmark />;
  if (variant === 'terminal') return <HeroTerminal />;
  return <HeroShield />;
}
