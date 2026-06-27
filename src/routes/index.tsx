import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rahul Shrestha - Software · Systems · Security" },
      {
        name: "description",
        content:
          "Portfolio of Rahul Shrestha — Computer engineering student building software, systems, and security tools.",
      },
      { property: "og:title", content: "Rahul Shrestha — Aspiring Computer Engineer" },
      { property: "og:description", content: "Software · Systems · Security. Kathmandu University." },
    ],
  }),
  component: Portfolio,
});

function Portfolio() {
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let mounted = true;
    import("@/lib/portfolio-boot").then(({ bootPortfolio }) => {
      if (!mounted) return;
      bootPortfolio().then((c) => {
        if (!mounted) c();
        else cleanup = c;
      });
    });
    return () => { mounted = false; cleanup?.(); };
  }, []);

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>

      <div className="grain" aria-hidden="true" />
      <canvas id="bg" aria-hidden="true" />

      <div id="cursor" aria-hidden="true">
        <canvas id="cursor-trail" />
        <div className="cursor-ring" />
        <div className="cursor-dot" />
      </div>

      <header>
        <nav className="pill" aria-label="Primary">
          <ul className="pill-links">
            <li>
              <a href="#about" data-cursor="hover">
                <span className="nav-dot" />
                <span className="nav-label">About</span>
              </a>
            </li>
            <li>
              <a href="#skills" data-cursor="hover">
                <span className="nav-dot" />
                <span className="nav-label">Skills</span>
              </a>
            </li>
            <li>
              <a href="#work" data-cursor="hover">
                <span className="nav-dot" />
                <span className="nav-label">Work</span>
              </a>
            </li>
            <li>
              <a href="#contact" data-cursor="hover">
                <span className="nav-dot" />
                <span className="nav-label">Contact</span>
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main id="main">
        {/* HERO */}
        <section id="hero" className="hero" data-bg="#0B0B0C">
          <div className="hero-aura" aria-hidden="true" />
          <div className="hero-inner container">
            <h1 className="hero-title">
              <span className="line fill" data-text="RAHUL">RAHUL</span>
              <span className="line stroke" data-text="SHRESTHA">SHRESTHA</span>
            </h1>
            <p className="hero-sub mono">
              // <b>Software</b> · <b>Systems</b> · <b>Security</b>
            </p>
          </div>
          <div className="hero-foot container">
            <span className="mono">©2026 RAHUL SHRESTHA</span>
            <span className="mono">/KU · CE · 2025–</span>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="about" data-bg="#15130F">
          <div className="container about-grid">
            <div className="about-text">
              <p className="eyebrow mono">// 01 — INTRODUCTION</p>
              <h2 className="display xxl" data-split>Hey.</h2>
              <p className="body" data-split-lines>
                Computer Engineering student passionate about solving real-world tech challenges.
                Self-driven learner, cybersecurity enthusiast, and a builder who prefers shipping over speculating.
              </p>
              <p className="body muted" data-split-lines>
                Currently at Kathmandu University (2025 — present). Previously Palpa Secondary School (2023 – 2025).
              </p>
              <ul className="tenets" aria-label="Working principles">
                <li data-tenet="build"><span className="t-num mono">01</span><span className="t-label">Ship over speculate</span></li>
                <li data-tenet="learn"><span className="t-num mono">02</span><span className="t-label">Read the source</span></li>
                <li data-tenet="break"><span className="t-num mono">03</span><span className="t-label">Break it to know it</span></li>
                <li data-tenet="share"><span className="t-num mono">04</span><span className="t-label">Document the path</span></li>
              </ul>
            </div>
            <div className="about-orb" aria-hidden="true">
              <div className="orb-readout" data-orb-readout>
                <span className="mono small orb-key">
                  <i className="orb-led" /> signal <span className="orb-freq" data-orb-freq>2.7Ghz</span>
                </span>
                <span className="mono orb-val" data-orb-val>
                  <span className="orb-caret">&gt;</span>
                  <span className="orb-text">idle</span>
                  <span className="orb-cursor">▌</span>
                </span>
                <span className="orb-bars" aria-hidden="true">
                  <i /><i /><i /><i /><i />
                </span>
              </div>
              <div className="orb-rings">
                <span /><span /><span />
              </div>
              <div className="orb-scan" aria-hidden="true" />
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="skills" data-bg="#0B0B0C">
          <div className="container skills-head">
            <div>
              <p className="eyebrow mono">// 02 — STACK</p>
              <h2 className="display xl" data-split>Skills.</h2>
            </div>
          <p className="skills-lede mono">Hover a skill — the inspector below reads its manifest and lights up its dependency graph.</p>
          </div>
          <div className="container skills-wrap">
            <ul className="skills-grid" aria-label="Technical skills">
              {[
                ["C", "systems", 80],
                ["C++", "app + cli", 78],
                ["JS", "web", 72, "JavaScript"],
                ["HTML", "markup", 88, "HTML5"],
                ["CSS", "layout", 82, "CSS3"],
                ["SQL", "data", 68, "SQL / MySQL"],
                ["Linux", "daily driver", 84],
                ["Git", "vcs", 76],
                ["Qt", "desktop", 62, "Qt 6"],
                ["Nmap", "recon", 70],
                ["Burp", "offsec", 58, "Burp Suite"],
                ["Python", "scripting", 66],
              ].map(([key, meta, p, label]) => (
                <li key={key as string} className="sk" data-skill={key} style={{ ["--p" as string]: p } as React.CSSProperties}>
                  <span className="sk-name">{(label as string) || (key as string)}</span>
                  <span className="sk-meta mono">{meta} · {p}</span>
                  <span className="sk-bar"><i /></span>
                </li>
              ))}
            </ul>
            <aside className="skills-stage">
              <svg className="constellation" viewBox="0 0 320 220" preserveAspectRatio="xMidYMid meet" data-constellation aria-hidden="true" />
            </aside>
          </div>
          <div className="marquee" aria-hidden="true">
            <div className="marquee-track mono">
              <span>C · C++ · HTML · CSS · JS · SQL · MySQL · Linux · Git · Qt · Nmap · Burp ·&nbsp;</span>
              <span>C · C++ · HTML · CSS · JS · SQL · MySQL · Linux · Git · Qt · Nmap · Burp ·&nbsp;</span>
              <span>C · C++ · HTML · CSS · JS · SQL · MySQL · Linux · Git · Qt · Nmap · Burp ·&nbsp;</span>
            </div>
          </div>
        </section>

        {/* WORK */}
        <section id="work" className="work" data-bg="#0E1A16">
          <div className="container">
            <p className="eyebrow mono">// 03 — WORK</p>
            <h2 className="display xl" data-split>Selected Work.</h2>

            <div className="grid">
              {/* Terminal */}
              <article className="card" data-cursor="hover">
                <div className="card-inner">
                  <div className="card-face">
                    <span className="card-idx mono">// 001 / 003</span><span className="flip-hint">tap → flip</span>
                    <div className="card-frame">
                      <div className="preview preview-term" aria-hidden="true">
                        <div className="term-chrome"><span /><span /><span /><b className="mono">~/tasks</b></div>
                        <pre className="term-body mono">
{`$ tm add `}<span className="t-acc">"ship portfolio"</span>{`
`}<span className="t-ok">+</span>{` #042 ship portfolio        `}<span className="t-dim">[high]</span>{`
$ tm ls --today
`}<span className="t-ok">✓</span>{` #038 review PRs
`}<span className="t-warn">●</span>{` #041 fix nav scroll
`}<span className="t-acc">▌</span>
                        </pre>
                      </div>
                      <div className="card-body">
                        <h3 className="card-title">Terminal Task Manager</h3>
                        <p className="card-desc">Keyboard-first task manager that lives in your terminal. JSON-backed, ncurses TUI, built for review-and-ship loops.</p>
                        <ul className="tags mono"><li>C++</li><li>ncurses</li><li>CLI</li></ul>
                      </div>
                      <div className="card-foot mono small">
                        <span>2025</span><span className="card-link">view repo →</span>
                      </div>
                    </div>
                  </div>
                  <div className="card-face back">
                    <div>
                      <h3 className="card-back-title">Terminal Task Manager</h3>
                      <p className="card-back-body">A keyboard-driven CLI that replaces my sticky-note workflow. JSON store, fuzzy search, recurring tasks, and a TUI that opens in &lt;50ms.</p>
                      <dl className="card-back-meta">
                        <div><dt>Stack</dt><dd>C++17 · ncurses</dd></div>
                        <div><dt>LOC</dt><dd>~3.4k</dd></div>
                        <div><dt>Role</dt><dd>solo</dd></div>
                        <div><dt>Status</dt><dd>shipped</dd></div>
                      </dl>
                    </div>
                    <div className="card-back-foot"><span>// 042</span><span>view repo →</span></div>
                  </div>
                </div>
              </article>

              {/* Qt */}
              <article className="card" data-cursor="hover">
                <div className="card-inner">
                  <div className="card-face">
                    <span className="card-idx mono">// 002 / 003</span><span className="flip-hint">tap → flip</span>
                    <div className="card-frame">
                      <div className="preview preview-qt" aria-hidden="true">
                        <div className="qt-chrome"><b className="mono">QtDesktop</b><span className="qt-dots"><i /><i /><i /></span></div>
                        <div className="qt-body">
                          <div className="qt-side">
                            <div className="qt-pill" /><div className="qt-pill short" /><div className="qt-pill" /><div className="qt-pill short" />
                          </div>
                          <div className="qt-main">
                            <div className="qt-card"><span /><span className="short" /></div>
                            <div className="qt-card"><span /><span className="short" /></div>
                            <div className="qt-graph">
                              <i style={{ ["--h" as string]: "60%" } as React.CSSProperties} />
                              <i style={{ ["--h" as string]: "35%" } as React.CSSProperties} />
                              <i style={{ ["--h" as string]: "80%" } as React.CSSProperties} />
                              <i style={{ ["--h" as string]: "50%" } as React.CSSProperties} />
                              <i style={{ ["--h" as string]: "72%" } as React.CSSProperties} />
                              <i style={{ ["--h" as string]: "40%" } as React.CSSProperties} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        <h3 className="card-title">Qt Desktop App</h3>
                        <p className="card-desc">Component-driven Qt6 application with a custom QSS theme, signal-slot architecture, and native packaging for Linux and Windows.</p>
                        <ul className="tags mono"><li>C++</li><li>Qt6</li><li>Cross-platform</li></ul>
                      </div>
                      <div className="card-foot mono small">
                        <span>2025</span><span className="card-link">case study →</span>
                      </div>
                    </div>
                  </div>
                  <div className="card-face back">
                    <div>
                      <h3 className="card-back-title">Qt Desktop App</h3>
                      <p className="card-back-body">Dashboard for managing a small inventory across two stores. Reactive signal-slot graph, custom QSS theme, native installers for Linux + Windows.</p>
                      <dl className="card-back-meta">
                        <div><dt>Stack</dt><dd>C++ · Qt6 · QSS</dd></div>
                        <div><dt>Build</dt><dd>CMake</dd></div>
                        <div><dt>Role</dt><dd>solo</dd></div>
                        <div><dt>Status</dt><dd>active</dd></div>
                      </dl>
                    </div>
                    <div className="card-back-foot"><span>// 028</span><span>case study →</span></div>
                  </div>
                </div>
              </article>

              {/* Pentest */}
              <article className="card" data-cursor="hover">
                <div className="card-inner">
                  <div className="card-face">
                    <span className="card-idx mono">// 003 / 003</span><span className="flip-hint">tap → flip</span>
                    <div className="card-frame">
                      <div className="preview preview-net" aria-hidden="true">
                        <svg viewBox="0 0 240 150" className="net-svg" preserveAspectRatio="xMidYMid meet">
                          <g className="net-edges" stroke="currentColor" strokeOpacity="0.35" fill="none">
                            <line x1="120" y1="75" x2="40" y2="30" />
                            <line x1="120" y1="75" x2="40" y2="120" />
                            <line x1="120" y1="75" x2="200" y2="30" />
                            <line x1="120" y1="75" x2="200" y2="120" />
                            <line x1="120" y1="75" x2="120" y2="20" />
                            <line x1="120" y1="75" x2="120" y2="130" />
                          </g>
                          <g className="net-nodes" fill="currentColor">
                            <circle cx="120" cy="75" r="6" />
                            <circle cx="40" cy="30" r="4" /><circle cx="40" cy="120" r="4" />
                            <circle cx="200" cy="30" r="4" /><circle cx="200" cy="120" r="4" />
                            <circle cx="120" cy="20" r="4" /><circle cx="120" cy="130" r="4" />
                          </g>
                        </svg>
                        <pre className="net-log mono">
{`nmap -sV 10.10.10.0/24
`}<span className="t-ok">open</span>{` 22/tcp  ssh
`}<span className="t-ok">open</span>{` 80/tcp  http
`}<span className="t-warn">filt</span>{` 443/tcp https`}
                        </pre>
                      </div>
                      <div className="card-body">
                        <h3 className="card-title">Personal Pentesting Lab</h3>
                        <p className="card-desc">Segmented VM network with vulnerable targets and a documented playbook for recon, exploitation, and post-exploitation.</p>
                        <ul className="tags mono"><li>Linux</li><li>Nmap</li><li>Burp</li></ul>
                      </div>
                      <div className="card-foot mono small">
                        <span>2026</span><span className="card-link">writeup →</span>
                      </div>
                    </div>
                  </div>
                  <div className="card-face back">
                    <div>
                      <h3 className="card-back-title">Personal Pentesting Lab</h3>
                      <p className="card-back-body">Isolated lab of 6 VMs, segmented by VLAN. Documented recon → foothold → privesc playbook with reproducible writeups for each box.</p>
                      <dl className="card-back-meta">
                        <div><dt>Net</dt><dd>pfSense · 3 VLANs</dd></div>
                        <div><dt>Targets</dt><dd>6 VMs</dd></div>
                        <div><dt>Tools</dt><dd>nmap · burp · gobuster</dd></div>
                        <div><dt>Status</dt><dd>ongoing</dd></div>
                      </dl>
                    </div>
                    <div className="card-back-foot"><span>// 064</span><span>writeup →</span></div>
                  </div>
                </div>
              </article>
            </div>

            <div className="timeline-rich" aria-label="Timeline">
              <header className="tl-head">
              </header>
              <div className="tl-track tl-vertical">
                <div className="tl-spine" />
                <div className="tl-progress" />
                <ol className="tl-items">
                  <li className="tl-item" data-parallax="0.06">
                    <span className="tl-dot" />
                    <div className="tl-card">
                      <p className="mono small tl-when">2023</p>
                      <h4 className="tl-title">Palpa Secondary School</h4>
                      <p className="tl-desc muted">+2 Science. First Linux install. First shell script.</p>
                    </div>
                  </li>
                  <li className="tl-item" data-parallax="0.10">
                    <span className="tl-dot" />
                    <div className="tl-card">
                      <p className="mono small tl-when">2024</p>
                      <h4 className="tl-title">Self-taught C / C++</h4>
                      <p className="tl-desc muted">Built CLI tools, started reading kernel docs and CTF writeups.</p>
                    </div>
                  </li>
                  <li className="tl-item" data-parallax="0.14">
                    <span className="tl-dot" />
                    <div className="tl-card">
                      <p className="mono small tl-when">2025</p>
                      <h4 className="tl-title">Kathmandu University · CE</h4>
                      <p className="tl-desc muted">Joined KUCC. Shipped a Qt desktop app and a terminal task manager.</p>
                    </div>
                  </li>
                  <li className="tl-item" data-parallax="0.18">
                    <span className="tl-dot" />
                    <div className="tl-card">
                      <p className="mono small tl-when">2026</p>
                      <h4 className="tl-title">Pentesting lab + portfolio</h4>
                      <p className="tl-desc muted">Offensive-security playbook, this site, open-source contributions.</p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="contact" data-bg="#0B0B0C">
          <div className="container">
            <p className="eyebrow mono">// 04 — CONTACT</p>
            <h2 className="display xl" data-split>Let’s build.</h2>
            <p className="body">Open to internships, collaborations, and CTF teams.</p>

            <a className="email-line" href="mailto:rahul.shrestha@example.com" data-cursor="hover">
              rahulshrestha5775@gmail.com
            </a>

            <ul className="icons" aria-label="Social links">
              <li>
                <a className="mag" href="https://github.com/arkybruh7" target="_blank" rel="noopener" aria-label="GitHub" data-cursor="hover">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
                    <path d="M12 .5C5.7.5.7 5.5.7 11.8c0 5 3.2 9.2 7.7 10.7.6.1.8-.2.8-.6v-2c-3.1.7-3.8-1.3-3.8-1.3-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.7 2.7 1.2 3.4.9.1-.8.4-1.3.7-1.6-2.5-.3-5.1-1.2-5.1-5.5 0-1.2.4-2.2 1.2-3-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.1.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.2-1.1 3.2-1.1.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3 0 4.3-2.6 5.3-5.1 5.5.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6 4.5-1.5 7.7-5.7 7.7-10.7C23.3 5.5 18.3.5 12 .5z" />
                  </svg>
                </a>
              </li>
              <li>
                <a className="mag" href="https://www.linkedin.com/in/rahul-shrestha-a48a1b336/" target="_blank" rel="noopener" aria-label="LinkedIn" data-cursor="hover">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
                    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.1c.5-.9 1.8-1.9 3.7-1.9 4 0 4.7 2.6 4.7 6V21h-4v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21h-4V9z" />
                  </svg>
                </a>
              </li>
              <li>
                <a className="mag" href="mailto:rahulshrestha5775@gmail.com" aria-label="Email" data-cursor="hover">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true">
                    <path d="M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5zm2 .4v.2l8 5.2 8-5.2v-.2H4zm16 2.6-7.5 4.9a1 1 0 0 1-1 0L4 8v11h16V8z" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer>
        <div className="foot-stars" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, i) => (
            <i key={i} style={{ ["--d" as string]: `${(i * 0.27) % 1}`, ["--x" as string]: `${(i * 53) % 100}%`, ["--y" as string]: `${(i * 37) % 100}%`, ["--s" as string]: `${0.6 + ((i * 0.13) % 1) * 1.6}` } as React.CSSProperties} />
          ))}
        </div>

        <div className="container foot-top">
          <span className="foot-tag">Crafted in the late hours</span>
          <span className="mono small foot-status">
            <i className="foot-led" />
            <span data-foot-status>now: shipping the portfolio</span>
          </span>
          <span className="mono small">arkybruh7@github</span>
        </div>

        <div className="foot-sig container" aria-label="Signature">
          <p className="sig-name">
            <span className="sig-pre mono">// signed,</span>
            <span className="sig-rahul">
              <span className="sig-glyph" data-text="R">R</span>
              <span className="sig-glyph" data-text="a">a</span>
              <span className="sig-glyph" data-text="h">h</span>
              <span className="sig-glyph" data-text="u">u</span>
              <span className="sig-glyph" data-text="l">l</span>
            </span>
            <span className="sig-flourish" aria-hidden="true">
              <svg viewBox="0 0 220 36" preserveAspectRatio="none">
                <path d="M2 28 C 40 4, 80 38, 120 18 S 200 4, 218 22" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </span>
          </p>
          <p className="sig-tag mono">
            <span className="sig-dot" /> still shipping &nbsp;·&nbsp; still curious &nbsp;·&nbsp; still breaking things
          </p>
        </div>

        <svg className="wordmark" viewBox="0 0 1000 220" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <text x="50%" y="80%" textAnchor="middle" fontFamily="Archivo, sans-serif" fontWeight="700" fontSize="260" letterSpacing="-5">
            RAHUL
          </text>
        </svg>
        <div className="container foot-bot">
          <span className="mono">BUILT 2026 · KATHMANDU · 27.7°N</span>
          <span className="mono">
            forged with <span className="heart" aria-label="love">♥</span> &amp; vim motions
          </span>
        </div>
      </footer>
    </>
  );
}
