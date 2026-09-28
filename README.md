# Hunter Frontend Demo

Production-quality Next.js frontend demo for **Piloteer Hunter** — a Sales Performance System. Built for the engineering team to extend.

## Overview

This is a complete, clickable mock-data demo covering the full Hunter experience:
- **Teach Hunter** journey (progressive onboarding)
- **Console** (prep sensing, live sensing with Pattern→Meaning→Move tips, follow-through)
- **Seller Performance Dashboard** (momentum, patterns, needs you queue)
- **Manager Dashboard** (team-level intelligence and intervention)
- **CRO Dashboard** (org-level revenue intelligence and systemic actions)
- **Ask Hunter** contextual drawer (accessible from dashboards)

## Design System

**Dark editorial Piloteer visual system:**
- Canvas: `#0B0B0E`–`#101014`
- Primary text: white
- Context/evidence: metallic gray `#b7babd`
- Surfaces: `#2c2c36`
- Signal red: meaningful risk/required action only
- Restrained green: verified positive progression only
- Type: Montserrat

**Principles:**
- Intelligence before information (lead with interpretation)
- One primary job per screen
- Evidence-based (no unexplained metrics)
- No surveillance aesthetics
- No seller leaderboards
- No close-probability vanity widgets

## Mock Narrative

**Piloteer** (our company) selling **Hunter** (our product) into **TechCorp Global** (fictional enterprise buyer).

- Primary deal: TechCorp Global at technical validation stage
- Buying committee: VP RevOps (champion), CRO, Director Sales Enablement, IT Security Lead
- Implementation concerns shifting from technical feasibility → organizational change management
- Security review completed; moving toward executive presentation
- Momentum: +32 (Gaining)

Secondary deals: Acme Europe, Globex, Midway Healthcare for dashboard context.

## Architecture

### Tech Stack
- **Next.js 15** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS** (custom Piloteer theme)
- **React 19**

### Project Structure

```
/workspace
├── app/                          # Next.js App Router pages
│   ├── console/                 # Console experience (prep, sense, follow-through)
│   ├── dashboard/               # Seller dashboard (Performance, Deals)
│   │   ├── manager/            # Manager dashboard
│   │   ├── cro/                # CRO dashboard
│   │   └── deals/              # Deals board view
│   ├── teach/                   # Teach Hunter onboarding journey
│   ├── layout.tsx               # Root layout (Montserrat font, metadata)
│   ├── globals.css              # Tailwind + custom utilities
│   └── page.tsx                 # Home page (demo entry)
│
├── components/                   # Shared React components
│   ├── DashboardNav.tsx         # Dashboard navigation
│   ├── EvidenceBadge.tsx        # Evidence level badges (validated/supported/etc)
│   ├── MomentumDisplay.tsx      # Momentum score component
│   ├── PatternCard.tsx          # Pattern display card
│   └── PiloteerLogo.tsx         # Logo component
│
├── lib/
│   ├── data/
│   │   └── mockData.ts          # Comprehensive typed mock data
│   └── types/
│       └── domain.ts            # Domain model types
│
└── public/
    └── logo.svg                  # White Piloteer logo on dark
```

## Domain Model

**Core Types** (`lib/types/domain.ts`):
- `Company`, `Contact`, `Deal`, `Interaction`
- `Pattern` (with `type: seller | buyer | buyer-seller | market`)
- `Evidence` (with `level: validated | supported | associated | observed`)
- `Momentum` (−100 to +100, with `direction: gaining | holding | losing`)
- `NeedsYouItem`, `PerformanceMetric`
- `TeachStep`, `ProductConfig`, `CompanyProfile`

**Pattern Structure** (used everywhere):
```
Pattern → Meaning → Evidence → Impact → Recommended Action
```

## Routes & IA

| Route | Purpose | Key Features |
|-------|---------|--------------|
| `/` | Home / demo entry | Links to all main experiences |
| `/teach` | Teach Hunter journey | 12-step progressive onboarding (products → personas → signals → company profile) |
| `/console` | Console (standalone companion) | Prep sensing, live sensing, follow-through — floating ~400px panel |
| `/dashboard` | Seller Performance | Book momentum, Needs You, Patterns (4 tabs), My Performance |
| `/dashboard/deals` | Deal board | Hunter Momentum / CRM Stage views |
| `/dashboard/manager` | Manager dashboard | Team book momentum, intervention queue, team patterns |
| `/dashboard/cro` | CRO dashboard | Revenue momentum, org-level patterns, systemic actions |
| `/settings` | Settings | Trust & Visibility, Model Updates, integrations |

**Navigation:**
- **Console:** Standalone surface with menu bar chrome (Piloteer Logo | Search | Start Sensing ▾ | + | More). Floating 400px panel. Logo opens dashboards.
- **Dashboards:** Performance | Deals | Team | Settings | Ask Hunter (drawer)
- **Teach:** Own journey chrome with step/product rail

## Product Rules & Constraints

✅ **Do:**
- Lead with interpretation, not raw metrics
- Show evidence level for all claims (validated/supported/associated/observed)
- Use Pattern→Meaning→Move structure for guidance
- Momentum scores deals/books, not people
- Keep private seller tips separate from manager visibility

❌ **Don't:**
- Show close probability percentages
- Create seller leaderboards or rankings
- Display unexplained metrics
- Mix seller performance with deal momentum
- Expose private live tips to managers
- Invent product features that contradict Vision/Blueprint/Dan's feedback

## Evidence Hierarchy

Use precise language matching evidence strength:
- **Validated**: Multiple interactions, clear causal connection
- **Supported**: Consistent pattern, correlation established  
- **Associated**: Observed together, relationship unclear
- **Observed**: Noticed, too early to draw conclusions

**Example:** "Momentum increased after guidance was actioned" (supported) vs "Guidance caused momentum increase" (requires validated).

## Momentum System

**Score:** −100 (losing badly) to +100 (gaining strongly), 0 = neutral

**Language:**
- **Gaining**: Active positive movement
- **Holding**: Stable, no significant change
- **Losing**: Active negative movement

**Not equivalent to:**
- Close probability (Hunter doesn't predict likelihood)
- Seller performance score (people vs deals distinction)
- CRM stage (orthogonal to momentum)

## Teach Hunter Journey

Progressive disclosure approach based on live Vercel Sales Configuration schema:

1. How many products?
2. Per product: About, Personas, Key Signals, Objectives, Differentiators, Objections, Competitive Landscape, Market Info
3. Company profile: Overview, Deal Stages, Sales Framework, Integrations

**Design principle:** Feels like teaching a new hire, not filling a CMS.

## Console Experience

**Two primary jobs:**
1. Prepare for a call
2. Sense during a call

**Prep Sensing (Follow-on):**
- Hunter's Read: current momentum, what changed, buyer cares about, unresolved, commitments, patterns
- Call details: type, seller role, people joining, goal
- Optional seller inputs (for context Hunter can't retrieve)
- Autosave states: Needs Prep / Draft / Prepared

**Live Sensing:**
- Private Pattern→Meaning→Move tips
- Short, specific, one move at a time
- Dismiss/rate, cooldown between tips
- No live tips visible to managers

**Follow-Through:**
- Outcome, commitments, blockers, next action
- Draft awaiting seller approval before CRM writeback

## Dashboard Philosophy

**Seller Dashboard** answers:
- Where are my deals moving?
- Why are they moving/stalling?
- What needs me?
- How am I improving?

**Manager Dashboard** answers:
- Where should I intervene?
- What patterns affect my team?
- What's improving/needs attention?

**CRO Dashboard** answers:
- What's accelerating/slowing revenue?
- What should we change/scale across the org?
- How is the system performing?

## Component Patterns

### MomentumDisplay
```tsx
<MomentumDisplay 
  score={32} 
  direction="gaining" 
  size="lg" 
  showLabel={true} 
/>
```

### EvidenceBadge
```tsx
<EvidenceBadge level="validated" />
<EvidenceBadge level="supported" />
<EvidenceBadge level="associated" />
<EvidenceBadge level="observed" />
```

### PatternCard
```tsx
<PatternCard 
  pattern={pattern} 
  showAffectedDeals={true} 
/>
```

## Running the App

### Prerequisites
- Node.js 18+ 
- npm

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm start
```

### Build Verification
```bash
npm run build
```
Should complete successfully with no errors.

## Extending the App

### Adding New Mock Data
Edit `lib/data/mockData.ts`. All data is typed via `lib/types/domain.ts`.

### Adding New Routes
Create new directories under `app/`. Follow App Router conventions.

### Adding Components
Place shared components in `components/`. Use existing patterns (MomentumDisplay, EvidenceBadge, etc).

### Styling
- Tailwind utility classes (defined in `tailwind.config.ts`)
- Custom utilities in `app/globals.css`
- Dark theme by default (bg-piloteer-black)

## Design Decisions

### Why one Console for all users?
Per Dan's Console feedback: "Managers and revenue leaders do not need separate Console experiences—their differences belong in the dashboards."

### Why no drag-to-change-stage in deals board?
From Vision/Blueprint: Deals board should not allow manual stage changes. Stages reflect CRM state; momentum is Hunter's interpretation.

### Why Momentum not Close Probability?
Hunter shows deal movement/direction, not likelihood of close. Momentum describes progression, not prediction.

### Why separate Seller/Buyer/Buyer×Seller patterns?
Hunter senses seller behavior and buyer response separately, then connects them. This maintains the behavioral science foundation vs treating interaction as single event.

### Why Evidence levels?
Avoid opaque scores and unexplained claims. Every intelligence statement is labeled with confidence level so users know what's validated vs still gathering evidence.

### Why no leaderboards?
Manager/CRO dashboards focus on patterns and system performance, not individual rankings. Momentum scores deals/books, not people. Creates coaching culture vs surveillance culture.

## Key Files Reference

| File | Purpose |
|------|---------|
| `lib/types/domain.ts` | All TypeScript domain types |
| `lib/data/mockData.ts` | Complete mock data (TechCorp, deals, patterns, etc) |
| `app/console/page.tsx` | Console experience (prep, sense, follow-through) |
| `app/dashboard/page.tsx` | Seller Performance dashboard |
| `app/dashboard/manager/page.tsx` | Manager dashboard |
| `app/dashboard/cro/page.tsx` | CRO dashboard |
| `app/teach/page.tsx` | Teach Hunter onboarding |
| `components/DashboardNav.tsx` | Main dashboard navigation |
| `tailwind.config.ts` | Piloteer theme colors |
| `app/globals.css` | Custom Tailwind utilities |

## Mock Data Highlights

**TechCorp Deal (Primary):**
- $180K, Technical Validation stage
- Momentum +32 (Gaining, +18 last week)
- Security review completed
- Champion (Sarah Chen) mentions board timeline pressure
- Implementation concerns shifting to change management (progression signal)

**Patterns:**
- Seller: Permission-based questioning (validated, 24 interactions, 3.2x buyer sharing)
- Buyer: Early IT involvement resolves security faster (validated, 18 interactions)
- Buyer×Seller: Acknowledgment > Defensiveness opens buyer sharing (supported, 15 interactions)
- Market: AI fatigue / tool sprawl (validated, 60% of discovery calls, 12 interactions)

**Needs You Queue:**
1. TechCorp follow-through awaiting approval
2. Acme prep needed (momentum losing, EU data residency blocker)
3. Midway missing context (competitive intelligence)

## Out of Scope (Frontend Demo Only)

- Real AI / LLM integration
- Live CRM/calendar connectors
- Authentication / user management
- Backend API
- Database
- Real-time sensing logic
- Mobile-optimized views
- i18n / localization

## Source of Truth

Decision priority when extending:
1. Dan Kasper locked feedback PDFs (Console, Rep Dashboard, Manager/CRO)
2. Vision/Blueprint thesis & personas
3. This README and inline code comments
4. Live Vercel app (content schema only, not visual/IA target)

## Intended Local Setup

This repo is named `hunter-frontend-demo`. When cloning for local development, use:

```bash
git clone <repo-url> hunter-frontend-demo
cd hunter-frontend-demo
npm install
npm run dev
```

## Questions or Issues?

Refer to:
- BUILD-BRIEF.md (authoritative requirements)
- Hunter-Context-Design-Blueprint.md (product vision & personas)
- Dan's feedback PDFs (Console, Rep Dashboard, Manager/CRO)
- This README

---

**Package:** hunter-frontend-demo  
**Version:** 0.1.0  
**Build Status:** ✅ `npm run build` passes  
**Last Updated:** September 2026
