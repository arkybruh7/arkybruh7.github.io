# Rahul Shrestha — Portfolio

A handcrafted personal portfolio built with **TanStack Start**, **React 19**, **Three.js**, and **GSAP**.

---

## Quick start (local)

Requires **Node 20+** and either **bun** (recommended) or **npm / pnpm**.

```bash
# 1. clone
git clone https://github.com/arkybruh7/portfolio.git
cd portfolio

# 2. install dependencies
bun install        # or: npm install / pnpm install

# 3. start the dev server
bun run dev        # → http://localhost:3000
```

That's it — hot-reload is on, edit anything in `src/` and the page updates instantly.

## Build for production

```bash
bun run build      # outputs to .output/
bun run preview    # serves the production build locally
```

## Hosting

The project targets edge runtimes and works out of the box on:

| Host           | Command                              |
| -------------- | ------------------------------------ |
| Cloudflare Pages | `bun run build` → upload `.output/` |
| Vercel         | Import the repo — auto-detects TanStack Start |
| Netlify        | `bun run build` with publish dir `.output/public` |
| Self-host      | `bun run build && node .output/server/index.mjs` |

No env vars are required for the static portfolio. If you fork it, just replace the
content in `src/routes/index.tsx` and the social links in the contact section.

## Project structure

```
├─ package.json
├─ src/
│  ├─ routes/          # file-based routes (TanStack Router)
│  │  ├─ __root.tsx    # html shell, fonts, meta
│  │  └─ index.tsx     # the portfolio page
│  ├─ lib/
│  │  └─ portfolio-boot.ts  # GSAP + Three.js + interactions
│  └─ styles.css       # design tokens + every section's styles
└─ vite.config.ts
```

## License

MIT — fork it, learn from it, ship your own.
