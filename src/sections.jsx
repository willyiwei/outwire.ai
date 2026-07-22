// sections.jsx — About, Topics, Content, Resources, Consulting, Contact, Footer

import React from 'react';
import { OUTWIRE_DATA } from './data.jsx';
import portraitUrl from '../assets/will-yi-portrait.jpg';

function SectionHead({ num, title, titleEm, titleAfter, sub }) {
  return (
    <div className="section-head reveal">
      <div className="num">{num}</div>
      <div>
        <h2>
          {title}{titleEm && <em> {titleEm}</em>}{titleAfter}
        </h2>
        {sub && <p className="sub">{sub}</p>}
      </div>
    </div>
  );
}

export function About() {
  const p = OUTWIRE_DATA.profile;
  return (
    <section id="about">
      <div className="container">
        <SectionHead
          num="§ 01 / ABOUT"
          title="Written by"
          titleEm="Will Yi."
          sub="Eighteen years in security and networking. Ten in leadership. Now focused on one question: how do we make AI systems trustworthy enough to ship?"
        />
        <div className="about-grid reveal">
          <figure className="about-portrait">
            <img
              src={portraitUrl}
              alt="Will Yi at a soccer stadium"
              width="900"
              height="1200"
              loading="lazy"
              decoding="async"
            />
            <figcaption>Will Yi · Outwire</figcaption>
          </figure>
          <div className="about-body">
            <p>
              I&rsquo;ve spent nearly two decades inside security teams at
              <em> Cisco</em> and <em>WatchGuard</em>, building and leading the
              engineering work behind firewalls, intrusion prevention, and the
              unsexy infrastructure that quietly keeps enterprises online.
            </p>
            <p>
              <em>Outwire</em> is the next chapter &mdash; a journal, a channel,
              and soon a consulting practice focused on the security problems
              that arrive with foundation models. The goal is not hype. It is
              threat models, working code, and honest field notes.
            </p>
            <div className="bio-meta">
              <div>
                <div className="label">Currently</div>
                <div className="value">
                  Engineering Manager &middot; transitioning into AI Security
                  engineering &amp; leadership
                </div>
              </div>
              <div>
                <div className="label">Based</div>
                <div className="value">{p.location}</div>
              </div>
              <div>
                <div className="label">Background</div>
                <div className="value">
                  <strong>CISCO</strong> · <strong>WATCHGUARD</strong><br/>
                  18 yrs security &amp; networking &middot; 10 yrs leadership
                </div>
              </div>
              <div>
                <div className="label">Credentials</div>
                <div className="value">{p.credentials.join(' · ')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Topics() {
  return (
    <section id="topics">
      <div className="container">
        <SectionHead
          num="§ 02 / TOPICS"
          title="What I"
          titleEm="cover."
          sub="A working taxonomy of AI security — the threats I write about, demo on video, and plan to consult on."
        />
        <div className="topic-grid reveal">
          {OUTWIRE_DATA.topics.map(t => (
            <div key={t.n} className="topic">
              <div className="topic-num">{t.n}</div>
              <h3>{t.title}</h3>
              <p>{t.body}</p>
              <div className="topic-arrow">→</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Content() {
  return (
    <section id="content">
      <div className="container">
        <SectionHead
          num="§ 03 / DISPATCHES"
          title="Latest"
          titleEm="work."
          sub="Practical AI security videos and long-form essays. New work will appear here when it is ready."
        />
        <div className="content-split reveal">
          <div className="content-col">
            <h3 className="col-title">
              <span className="mono-label">Video</span>
              <span>On YouTube.</span>
            </h3>
            {OUTWIRE_DATA.videos.map(v => (
              <article key={v.title} className="video-card planned">
                <div className="video-thumb">
                  <div className="thumb-pattern" />
                  <div className="thumb-duration">Planned</div>
                  <div className="thumb-label">{v.accent}</div>
                </div>
                <div className="video-meta">
                  <span className="dot">●</span>
                  <span>{v.status}</span>
                </div>
                <h4 className="video-title">{v.title}</h4>
              </article>
            ))}
            <a className="col-cta" href="https://www.youtube.com/@outwireai" target="_blank" rel="noopener">
              All episodes
            </a>
          </div>

          <div className="content-col">
            <h3 className="col-title">
              <span className="mono-label">Essay</span>
              <span>On Substack.</span>
            </h3>
            {OUTWIRE_DATA.posts.map(p => {
              const contents = (
                <>
                  <div className="post-meta">
                    <span className="num">{p.status}</span>
                  </div>
                  <h4 className="post-title">{p.title}</h4>
                  <p className="post-excerpt">{p.excerpt}</p>
                </>
              );

              return p.url ? (
                <a key={p.title} className="post-card" href={p.url} target="_blank" rel="noopener">
                  {contents}
                </a>
              ) : (
                <article key={p.title} className="post-card planned">
                  {contents}
                </article>
              );
            })}
            <a className="col-cta" href="https://outwire.substack.com/" target="_blank" rel="noopener">
              Full archive
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Resources() {
  return (
    <section id="resources">
      <div className="container">
        <SectionHead
          num="§ 04 / LIBRARY"
          title="Required"
          titleEm="reading."
          sub="The frameworks, essays and field guides I return to. Curated for engineers learning AI security in public."
        />
        <div className="resources-list reveal">
          {OUTWIRE_DATA.resources.map(r => (
            <div key={r.n} className="resource">
              <div className="num">{r.n}</div>
              <div className="title">{r.title}</div>
              <div className="author">{r.author}</div>
              <div className="kind">{r.kind}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Consulting() {
  return (
    <section id="consulting" className="consulting">
      <div className="container">
        <SectionHead
          num="§ 05 / PRACTICE"
          title="Consulting,"
          titleEm="soon."
          sub="A practice focused on AI security for product teams. Threat models, red-team engagements, and architecture reviews, starting later this year."
        />
        <div className="consulting-wrap reveal">
          <div className="consulting-body">
            <p>
              If you&rsquo;re shipping an LLM application and don&rsquo;t
              know what&rsquo;s in the <em>blast radius</em> of your agent,
              we should talk. I&rsquo;m booking Q3 conversations now.
            </p>
            <div className="available">
              <span className="pulse" />
              Booking Q3 · 2026
            </div>
          </div>
          <div className="services">
            {OUTWIRE_DATA.services.map(s => (
              <div key={s.n} className="service">
                <div className="num">{s.n}</div>
                <div className="name">{s.name}</div>
                <div className="status">{s.status}</div>
              </div>
            ))}
            <a className="consulting-btn" href="mailto:hello@outwire.ai">
              Start a conversation <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section id="contact">
      <div className="container">
        <SectionHead
          num="§ 06 / CONTACT"
          title="Find me"
          titleEm="online."
          sub={null}
        />
        <div className="contact-wrap reveal">
          <div>
            <h3 className="contact-head">
              Let&rsquo;s talk <em>AI&nbsp;security.</em>
            </h3>
            <p className="contact-body">
              Questions, collaborations, speaking, or a threat model that keeps
              you up at night &mdash; the inbox is open. I read everything.
            </p>
            <a className="contact-email" href="mailto:hello@outwire.ai">
              hello@outwire.ai
            </a>
          </div>
          <div className="channels">
            {OUTWIRE_DATA.channels.map(c => (
              <a key={c.n} className="channel" href={c.url} target="_blank" rel="noopener">
                <div className="ch-num">{c.n}</div>
                <div className="ch-info">
                  <div className="ch-name">{c.name}</div>
                  <div className="ch-handle">{c.handle}</div>
                </div>
                <div className="ch-arrow">↗</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-left">
          <span>© 2026 Outwire</span>
          <span className="sep">/</span>
          <span>AI Security for Everyone</span>
          <span className="sep">/</span>
          <span>v26.04</span>
          <span className="sep">/</span>
          <a href="/privacy/">Privacy</a>
        </div>
        <div className="footer-right">
          Hand-built in Seattle <em>·</em> with suspicion
        </div>
      </div>
    </footer>
  );
}
