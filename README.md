# Optics Valley Toastmasters Club — Website

Official website for Optics Valley Toastmasters Club (Club #02793285, District 128, Area W01, Wuhan).

## Stack
Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Motion · self-hosted fonts (@fontsource)

> **Why Next.js 15, not 16?** Next.js 16.3.2 was found to have the dev server (both
> Turbopack and webpack modes) exit silently within seconds of starting, on Fedora 44 +
> Node 22, with no error output. A bare Node.js `http` server on the same machine stayed
> up fine, isolating the issue to Next 16.3.2 itself — likely a fresh regression in a very
> new release. Pinned to `^15.5.23` (a mature, stable release) as a result. Before
> upgrading past 16.x again, confirm `npm run dev` actually stays running for a full
> minute untouched, not just that it prints "Ready".

## Getting started
```bash
npm install
npm run dev
```
Visit http://localhost:3000

## Project structure
```
src/
  app/            Routes (Next.js App Router)
  components/
    ui/           Small reusable primitives (Button, Card, etc.)
    layout/       Nav, Footer, page shell
    sections/     Homepage/page-specific sections
  config/
    club.ts       Single source of truth for all real club facts — edit here
  lib/             Shared utilities (cn, etc.)
  types/           Shared TypeScript types
  data/            Static content data (e.g. meeting agendas) not yet backed by a DB
public/
  images/
    logo/          Club logo assets
    characters/    Custom illustration slot (optional, see below)
```

## Editing club information
All facts (meeting time, location, exec team, contact info) live in `src/config/club.ts`.
Never hardcode these in a component — import from this file so updates happen in one place.

## Adding custom illustrations later
Drop transparent PNG or SVG files into `public/images/characters/`. Hero and section
components check for their presence and fall back to a clean abstract background if absent —
no code changes needed to add them later.

## Environment variables
See `.env.example`. Nothing is required for Phase 1.
