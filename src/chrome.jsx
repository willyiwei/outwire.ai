// chrome.jsx — Topbar, Tweaks panel, and App root

import React from 'react';
import ReactDOM from 'react-dom/client';
import shieldUrl from '../assets/outwire-shield-header.jpg';
import { Hero } from './hero.jsx';
import { About, Topics, Content, Resources, Consulting, Contact, Footer } from './sections.jsx';

function Topbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuButtonRef = React.useRef(null);
  const firstMenuLinkRef = React.useRef(null);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    firstMenuLinkRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth > 960) setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`topbar ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
      <div className="topbar-inner">
        <a className="brand" href="#top" onClick={closeMenu}>
          <img className="brand-mark" src={shieldUrl} alt="" />
          <span className="brand-word">Outwire<sup>AI™</sup></span>
        </a>
        <button
          ref={menuButtonRef}
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen(open => !open)}
        >
          <span>{menuOpen ? 'Close' : 'Menu'}</span>
          <span className="menu-icon" aria-hidden="true"><i /><i /></span>
        </button>
        <button className={`menu-backdrop ${menuOpen ? 'open' : ''}`} type="button" aria-label="Close navigation" onClick={closeMenu} />
        <nav id="primary-navigation" className={`nav ${menuOpen ? 'open' : ''}`} aria-label="Primary navigation">
          <a ref={firstMenuLinkRef} href="dc34/" onClick={closeMenu}>DEF CON 34</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#topics" onClick={closeMenu}>Topics</a>
          <a href="#content" onClick={closeMenu}>Dispatches</a>
          <a href="#resources" onClick={closeMenu}>Library</a>
          <a href="#consulting" onClick={closeMenu}>Consulting</a>
          <a className="cta" href="https://outwire.substack.com/" target="_blank" rel="noopener" onClick={closeMenu}>Subscribe</a>
        </nav>
      </div>
    </header>
  );
}

function TweakRow({ label, options, value, onChange }) {
  return (
    <div className="tweak-row">
      <div className="tweak-label">{label}</div>
      <div className="tweak-opts">
        {options.map(o => (
          <button
            key={o.value}
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
          >{o.label}</button>
        ))}
      </div>
    </div>
  );
}

const TWEAK_DEFAULTS = {
  gold: 'champagne',
  display: 'serif',
  density: 'editorial',
  hero: 'terminal',
};

function Tweaks({ open, values, onChange }) {
  return (
    <div className={`tweaks ${open ? 'open' : ''}`}>
      <h4>Tweaks</h4>
      <div className="tweaks-sub">Art-direction knobs for this issue.</div>

      <TweakRow
        label="Hero variant"
        value={values.hero}
        onChange={(v) => onChange('hero', v)}
        options={[
          { value: 'shield', label: 'Shield' },
          { value: 'wordmark', label: 'Wordmark' },
          { value: 'terminal', label: 'Terminal' },
        ]}
      />
      <TweakRow
        label="Gold shade"
        value={values.gold}
        onChange={(v) => onChange('gold', v)}
        options={[
          { value: 'champagne', label: 'Champagne' },
          { value: 'bright', label: 'Bright' },
          { value: 'warm', label: 'Warm' },
        ]}
      />
      <TweakRow
        label="Display type"
        value={values.display}
        onChange={(v) => onChange('display', v)}
        options={[
          { value: 'serif', label: 'Serif' },
          { value: 'sans', label: 'Sans' },
          { value: 'mono', label: 'Mono' },
        ]}
      />
      <TweakRow
        label="Density"
        value={values.density}
        onChange={(v) => onChange('density', v)}
        options={[
          { value: 'editorial', label: 'Editorial' },
          { value: 'compact', label: 'Compact' },
        ]}
      />
    </div>
  );
}

function App() {
  const [values, setValues] = React.useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('outwire:tweaks') || 'null');
      return { ...TWEAK_DEFAULTS, ...(saved || {}) };
    } catch { return TWEAK_DEFAULTS; }
  });
  const [tweaksOpen, setTweaksOpen] = React.useState(false);

  React.useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-gold', values.gold);
    root.setAttribute('data-display', values.display);
    root.setAttribute('data-density', values.density);
    try { localStorage.setItem('outwire:tweaks', JSON.stringify(values)); } catch {}
  }, [values]);

  const setKey = (k, v) => {
    setValues(prev => ({ ...prev, [k]: v }));
  };

  // Design-tool tweaks protocol
  React.useEffect(() => {
    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type === '__activate_edit_mode')   setTweaksOpen(true);
      if (d.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', onMsg);
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch {}
    return () => window.removeEventListener('message', onMsg);
  }, []);

  return (
    <>
      <Topbar />
      <main id="top">
        <Hero variant={values.hero} />
        <About />
        <Topics />
        <Content />
        <Resources />
        <Consulting />
        <Contact />
      </main>
      <Footer />
      <Tweaks open={tweaksOpen} values={values} onChange={setKey} />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
