# Goalers — Capstone Planning

## Project Summary

Goalers is a social accountability web platform where users publicly commit to goals, post evidence of progress, and receive encouragement and validation from others.

Instead of tracking goals privately in a notes app or abandoning habit trackers after a few days, Goalers turns self-improvement into a lightweight social experience. Users post “proof of action” — workouts completed, study sessions finished, portfolio updates shipped, habits maintained — and receive lightweight social reinforcement through cheers and visibility.

The product combines:

- accountability
- social visibility
- lightweight gamification
- positive reinforcement

The first version will focus on a tightly scoped responsive web app.

---

# Core Problem

People struggle to stay consistent with long-term goals because:

- motivation fades
- progress feels invisible
- habits are isolated and private
- most productivity apps lack emotional reinforcement

Goalers attempts to solve this by making progress:

- visible
- social
- rewarding
- harder to quietly abandon

---

# Key Insight

People are often more consistent when others can see their progress because social reinforcement creates shorter and more durable reward loops than the distant payoff of achieving the goal itself.

Goalers leverages:

- positive reinforcement (encouragement, validation, recognition)
- mild social pressure/accountability
- visible progress
- recurring feedback loops

The hypothesis is that extrinsic motivation can help users sustain the consistency required long enough for intrinsic motivation, identity change, or real results to emerge.

---

# Unfair Advantage

Many productivity apps optimize for private tracking.

Goalers instead combines:

- social accountability
- lightweight public proof
- gamification mechanics
- emotional reinforcement

The inspiration comes from:

- Duolingo (motivation systems)
- fitness accountability communities
- BeReal-style lightweight posting
- study communities
- habit streak systems

---

# Tech Stack

## Frontend

- SvelteKit

## Backend / Database

- Neon (PostgreSQL)
- Drizzle ORM (schema + migrations)
- Better Auth (email/password sessions)

All database access runs through SvelteKit server code (loads, form actions). The browser never receives database credentials.

**Stack decision:** The project was scaffolded with `sv create` using Neon + Better Auth + Drizzle. This plan matches that stack (not Supabase).

## Deployment

- Netlify (hosting + serverless functions for SvelteKit)

## Media / File Storage

- Netlify Blobs — evidence photo uploads (binary files)
- `@netlify/blobs` in server-side upload handlers (form actions)
- Neon stores metadata only (`photo_url`, `photo_key` on `evidence_posts`); image bytes are not stored in Postgres

Upload flow (Stage 3.5):

1. Authenticated user submits evidence form with image file + text + goal
2. Server action validates session, ownership, file type/size
3. Server writes file to Netlify Blobs, gets public URL
4. Server inserts `evidence_posts` row with URL and blob key

Environment variables (local + Netlify):

- Existing: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `ORIGIN`
- Stage 3.5: Netlify Blobs credentials (provided automatically on Netlify deploy when Blobs are enabled for the site; use Netlify CLI / dashboard for local dev — see [Netlify Blobs docs](https://docs.netlify.com/blobs/overview/))

Limits (MVP):

- Server-mediated upload through SvelteKit form action (keep implementation simple)
- Max file size ~5 MB; allow JPEG, PNG, WebP only
- One photo per evidence post (required after Stage 3.5)

Billing: Netlify Blobs usage may incur cost on your Netlify account; acceptable for capstone.

## Optional Services

- Resend (only if time allows)

---

# Routing / Access Control

## Public Routes

Accessible without login:

- landing page
- login/signup pages

## Protected Routes

Require authentication:

- My Goals (`/my-goals`)
- create goal flow
- create evidence flow
- All Goals feed (`/all-goals`)
- cheering
- flagging

All social functionality requires login.

---

# MVP Product Decisions

## Visibility

For the MVP, all goals and evidence posts are public to registered and logged-in users.

There is no follower model, private mode, or group-based visibility in v1.

---

## Feed Definition

The activity feed is a chronological list of all public evidence posts from all users.

This keeps the MVP simple and avoids needing networks, groups, or discovery logic.

---

## Evidence Format

Evidence posts are lightweight “proof of action” updates tied to a goal. Each post includes:

- short text (`content`) describing what the user did
- one **photo** uploaded by the user (stored in Netlify Blobs)
- a public URL (`photo_url`) and blob key (`photo_key`) stored in Neon for feed display and optional cleanup on delete

Photos are the primary visual proof in the feed (replacing the earlier stamp-picker concept from the UI shell).

Implementation is split across stages:

- **Stage 3:** text + goal link persist in the database; feed and create flows work end-to-end without photos yet (or with a nullable `photo_url` until 3.5 ships)
- **Stage 3.5:** photo upload via Netlify Blobs; create flow requires an image; feed cards render photos

Tradeoff:
Uploads add object-storage and validation work, but photographic proof matches the product story (BeReal-style accountability) better than curated emoji stamps.

---

## Reactions

The MVP supports one reaction type: Cheer.

Rules:

- One cheer per user per post
- Clicking Cheer adds the reaction
- Clicking again removes it
- Duplicate cheers are prevented by a unique `(post_id, user_id)` constraint

---

## Moderation / Spam

Because all posts are public to logged-in users, spam is technically possible.

For the capstone MVP:

- users can flag evidence posts (text and images)
- flags are stored in the database
- no moderation workflow is built yet
- no automated spam detection or image content scanning exists

Flags are effectively invisible operationally in MVP because no admin tooling exists yet.

This is enough to acknowledge the abuse vector (including inappropriate images) without overbuilding moderation systems. Photo uploads make flagging more meaningful in Stage 4.

---

# Threat Model / Abuse Assumptions

The MVP protects against:

- unauthorized writes through missing server-side ownership checks
- users modifying other users' content
- duplicate cheers
- forged or bypassed session checks on protected server actions
- unauthenticated or cross-user evidence uploads (server actions only; session required)
- obviously invalid uploads (wrong MIME type, over size limit) rejected server-side

The MVP does NOT protect against:

- spam accounts
- coordinated abuse
- offensive text or image content
- fake accountability claims (staged photos)
- high-volume scraping
- moderation backlog
- storage cost abuse (no per-user upload quotas beyond file size cap)

This is acceptable for a small-scale capstone demo.

---

# MVP Scope

The capstone version will remain intentionally small and focused.

## Core Features

- user authentication
- create goals
- create evidence/progress posts **with photo upload** (Netlify Blobs)
- chronological public feed (displays evidence photos)
- lightweight reactions/validation
- basic evidence flagging

## Nice-to-Have

- simple streak display
- avatars/profile images (separate from evidence photos; still optional)
- improved feed polish (image loading skeletons, lightbox)

## Explicitly Out of Scope

- accountability circles/groups
- notifications
- team competitions
- leaderboards
- advanced gamification
- real-time systems
- multiple images per evidence post
- image editing/cropping tools
- automated image moderation / NSFW detection
- follower systems
- private goals

---

# Core Data Models

## user

Managed by Better Auth via the Drizzle adapter (tables in `src/lib/server/db/auth.schema.ts`: `user`, `session`, `account`, etc.).

Stores:

- authentication identity
- email
- password credentials

Email is the source of truth on the `user` table. Emails will NOT be duplicated in `profiles` to avoid synchronization drift.

---

## profiles

Represents public user profile information.

Fields:

- id
- username
- created_at

Rules:

- `profiles.id` is both:
  - primary key
  - foreign key referencing `user.id` (Better Auth)
- username must be unique
- username is set at signup
- usernames are publicly visible

Profile rows are created after signup (insert in the sign-up server action).

---

## goals

Represents goals users want accountability for.

Fields:

- id
- user_id
- title
- description
- frequency_target
- created_at

Notes:

- `frequency_target` is informational only in MVP
- stored as free text (example: "3x/week")
- no automated habit validation logic yet

---

## evidence_posts

Represents proof/progress updates tied to goals.

Fields:

- id
- user_id
- goal_id
- content
- photo_url
- photo_key
- created_at

Notes:

- `photo_url` — public URL served from Netlify Blobs (set in Stage 3.5)
- `photo_key` — blob store key for delete/replace when user removes their post
- `photo_url` / `photo_key` may be nullable during Stage 3 only; required once Stage 3.5 ships
- all evidence posts are public to authenticated users
- on delete: remove Neon row and delete blob by `photo_key` (best-effort in MVP)

---

## cheers

Represents lightweight positive reinforcement.

Fields:

- id
- post_id
- user_id
- created_at

Rules:

- unique constraint on `(post_id, user_id)`
- acts as a toggle interaction

---

## post_flags

Represents lightweight spam/inappropriate content reporting.

Fields:

- id
- post_id
- user_id
- reason
- created_at

Rules:

- unique constraint on `(post_id, user_id)`
- one flag per user per post

Notes:

- no moderation dashboard in MVP
- data collection only

---

# Authorization Rules (Server-Side)

All rules are enforced in SvelteKit server loads and form actions using `event.locals.user` from Better Auth (`hooks.server.ts`). Every query and mutation must scope by the authenticated user id. Postgres RLS is not used in the MVP.

---

## profiles

### Read

Authenticated users can read all profiles.

### Insert/Update

Users can only create/update their own profile where `profiles.id` matches the session user id.

---

## goals

### Read

Authenticated users can read all goals.

### Create

Users can only create goals where `goals.user_id` matches the session user id.

### Update/Delete

Users can only modify their own goals (verify `goals.user_id` before update/delete).

---

## evidence_posts

### Read

Authenticated users can read all evidence posts.

### Create

Users can only create evidence posts where:

- `evidence_posts.user_id` matches the session user id
- the referenced `goal_id` belongs to that same user
- (Stage 3.5) the uploaded photo is written to Netlify Blobs in a server action under the same session — never trust client-supplied `photo_url` / `photo_key` without server-side upload

This prevents users from attaching evidence to another user's goals or pointing posts at blobs they do not own.

### Update/Delete

Users can only modify their own evidence posts. On delete (Stage 3.5), server should delete the associated Netlify Blob when `photo_key` is present.

---

## cheers

### Read

Authenticated users can read all cheers.

### Create/Delete

Users can only create/remove cheers where `cheers.user_id` matches the session user id.

This prevents forged cheer ownership.

---

## post_flags

### Create

Users can only create flags where `post_flags.user_id` matches the session user id.

This prevents forged flag ownership.

### Read

Users can only read their own flags.

No admin moderation interface exists in MVP.

---

# Development Stages

# Stage 1 — Deployable Frontend Shell

Goal:
Create a working SvelteKit application that is already deployed online, even before real backend functionality exists.

Why:
The project depends on cloud services (Neon + Netlify). Deploying early reduces integration risk and avoids discovering auth/environment issues late in development.

Tasks:

- scaffold SvelteKit project DONE
- create GitHub repository DONE
- connect repository to Netlify DONE
- configure automatic deployments DONE
- create base routes/layouts DONE
- create placeholder UI using hardcoded data DONE

Pages:

- landing page DONE
- login/signup screens DONE
- My Goals shell (`/my-goals`) DONE
- placeholder All Goals list (`/all-goals`) DONE
- placeholder goal cards DONE

Notes:
This stage intentionally uses fake data.
The objective is infrastructure confidence and UI scaffolding, not functionality.

Success Criteria:

- local development works
- Netlify deployment works
- every major page route exists
- responsive layout works
- production URL updates automatically on push

Estimated Time:
~2 hours

---

# Stage 2 — Database & Auth Foundation

Goal:
Establish the real backend infrastructure and authentication layer.

Tasks:

- configure environment variables (`DATABASE_URL`, `BETTER_AUTH_SECRET`, `ORIGIN`) locally and on Netlify
- define app tables in Drizzle schema (`src/lib/server/db/schema.ts`)
- run `db:generate` / `db:push` to Neon
- wire Better Auth on `/login` and `/signup` (pattern from `src/routes/demo/better-auth/login/+page.server.ts`)
- add `(app)/+layout.server.ts` route guards
- implement logout in app nav
- remove demo bypass links on auth pages
- verify auth on localhost and production Netlify deploy

Technical Notes:

- Better Auth + `sveltekitCookies` plugin (already in `src/lib/server/auth.ts`)
- Session via `event.locals.user` / `event.locals.session`
- Verify auth behavior in BOTH localhost and deployed production environment

Important:
Do not continue until authentication works reliably in production.

Success Criteria:

- users can sign up
- users can sign in
- auth persists after refresh
- production deploy has correct env vars and auth works
- protected `(app)` routes redirect unauthenticated users
- app tables exist in Neon
- authorization rules documented and ready for Stage 3 enforcement in server code

Estimated Time:
~3 hours

---

# Stage 3 — Core Vertical Slice

Goal:
Implement the complete core product loop end-to-end using real data (text evidence first; photos in Stage 3.5).

Core Loop:
create goal → create evidence post → see post in feed

Tasks:

- create goals table integration
- create evidence posts integration (`content`, `goal_id`; `photo_url` / `photo_key` nullable until 3.5)
- create My Goals data loading
- create public chronological feed
- create protected create flows (`/goals/new`, `/evidence/new`)
- connect forms to database
- implement CRUD operations
- validate ownership/security rules
- remove placeholder banners and mock data from app routes

Notes:
This is the first fully functional version of Goalers. Do **not** block this stage on Netlify Blobs — ship the loop with text-only evidence if needed, then add required photos in Stage 3.5.

The Stage 1 UI still has a visual-stamp picker; replace that flow in Stage 3.5 with a file input + preview.

Priority:
Functionality over polish.

Success Criteria:

- authenticated users can create goals
- authenticated users can create evidence posts (text + goal)
- evidence posts persist in database
- feed loads real data
- users only modify their own records
- server-side ownership checks prevent unauthorized writes

Estimated Time:
~3 hours

---

# Stage 3.5 — Evidence Photo Upload (Netlify Blobs)

Goal:
Replace stamp-based evidence visuals with user-uploaded photos stored in Netlify Blobs, wired through SvelteKit server actions.

Why:
Photographic proof is core to the product story. Doing this after Stage 3 keeps the vertical slice unblocked while still landing photos before social features (cheers/flags on image posts).

Tasks:

- enable Netlify Blobs on the Netlify site (dashboard); verify local dev with Netlify CLI / env as needed
- add `@netlify/blobs` dependency
- extend Drizzle schema: `photo_url`, `photo_key` on `evidence_posts` (migrate off `visual_stamp` if still present in schema/UI)
- implement upload in `/evidence/new` form action: validate MIME + size, write blob, store URL + key
- update create evidence UI: file input, client preview, remove stamp picker
- update feed (`FeedPost`) and any goal detail views to render `photo_url` (aspect ratio, alt text, broken-image fallback)
- on evidence delete: delete blob by `photo_key` then delete DB row
- verify upload works on **production** Netlify deploy (not only localhost)
- update landing copy that still mentions “visual stamps”

Technical Notes:

- Upload runs server-side in form action after auth check (same pattern as other mutations)
- Never accept raw `photo_url` from the client without the server having written the blob
- Keep one image per post; required on create after this stage

Success Criteria:

- authenticated users must attach a photo when posting evidence
- images persist in Netlify Blobs and display in the public feed
- unauthorized users cannot upload or attach blobs to others' goals
- deleting own evidence removes the blob (best-effort acceptable for MVP)
- production deploy uploads successfully with Blobs enabled

Estimated Time:
~2 hours

---

# Stage 4 — Social Reinforcement Loop

Goal:
Add lightweight social interaction systems that create accountability and emotional reinforcement.

Tasks:

- implement cheer toggling
- implement cheer counts
- implement evidence flagging
- add interaction states/loading states
- improve onboarding clarity
- test second-account interactions

Notes:
This stage transforms the product from a CRUD app into a social accountability experience. Run **after Stage 3.5** so cheers and flags apply to photo evidence posts.

Success Criteria:

- users can cheer posts
- users can remove cheers
- duplicate cheers are prevented
- users can flag posts
- duplicate flags are prevented
- second-account demo flow works correctly

Estimated Time:
~2 hours

---

# Stage 5 — Polish + Demo Readiness

Goal:
Improve quality, presentation, and reliability for final presentation/demo.

Task Examples (detailed instructions will following in subsections):

- typography pass
- spacing/layout refinement
- responsive polish (including evidence photos in feed cards)
- hover/focus states
- loading states (including image load skeletons for feed photos)
- empty states
- bug fixes
- cleanup inconsistent UI
- improve perceived product quality

Notes:
Photo **upload pipeline** belongs in Stage 3.5, not here. This stage is presentation and reliability only.

Priority:
The app should feel intentional and coherent, even if feature scope remains small.

Success Criteria:

- portfolio/demo ready
- easy to understand quickly
- visually coherent
- stable during presentation
- core flows feel smooth

Estimated Time:
~2 hours



## **5.1 Final visual pass: night-mode athletic style**

Implement a CSS-only visual refresh. Do **not** change app logic, routes, database code, auth behavior, or component structure unless absolutely necessary for class/style cleanup.

### **Visual direction**

Goalers should feel like:

modern night-mode social accountability with fun, naive athletic energy

References:

- Nike Run Club energy
- amateur athletics
- bold social momentum
- bright highlight colors on a dark base

Avoid:

- elegant wellness minimalism
- Apple Fitness polish
- betting app/casino styling
- generic Tailwind SaaS
- football-specific theming

### **Typography**

Use two typefaces:

```css
@import url('https://fonts.googleapis.com/css2?family=Bungee&family=Inter:wght@400;500;600;700;800&display=swap');
```

Use:

```css
--font-display: 'Bungee', system-ui, sans-serif;
--font-ui: 'Inter', system-ui, sans-serif;
```

Rules:

- Use **Bungee** only for:
  - Goalers wordmark
  - landing page hero headline
  - major page titles like “All Goals”
  - small athletic labels if appropriate
- Use **Inter** for everything else:
  - body copy
  - cards
  - buttons
  - navigation
  - feed content
  - forms

### **Color tokens**

Add or update global CSS variables:

```css
:root {
  --color-bg: #080D0B;
  --color-surface: #101815;
  --color-surface-2: #16221D;
  --color-card-light: #FFFDF4;

  --color-text: #F7F7EE;
  --color-text-muted: #B8C2BA;
  --color-text-dark: #111A17;
  --color-text-dark-muted: #4D5A54;

  --color-primary: #C7FF1A;
  --color-primary-hover: #B7F000;

  --color-green: #2F5B49;
  --color-orange: #FF6B1A;
  --color-purple: #9B5CFF;
  --color-blue: #2F8CFF;
  --color-yellow: #FFD447;

  --color-border-dark: rgba(255, 255, 255, 0.12);
  --color-border-light: rgba(17, 26, 23, 0.14);

  --shadow-card: 0 18px 40px rgba(0, 0, 0, 0.28);
}
```

### **Page background**

Set the main app background to night mode:

```css
body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-ui);
}
```

Optional but preferred:

```css
body {
  background:
    radial-gradient(circle at top right, rgba(199, 255, 26, 0.10), transparent 28rem),
    linear-gradient(180deg, #080D0B 0%, #0D1411 100%);
}
```

### **Inverted cards rule**

Goal cards and evidence/proof cards are the big exception.

They should stay light:

```css
.goal-card,
.evidence-card,
.proof-card {
  background: var(--color-card-light);
  color: var(--color-text-dark);
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-card);
}
```

Text inside these cards should use dark tokens:

```css
.goal-card p,
.evidence-card p,
.proof-card p {
  color: var(--color-text-dark-muted);
}
```

### **Buttons**

Primary CTA:

```css
.button-primary {
  background: var(--color-primary);
  color: #07100C;
  border: 1px solid var(--color-primary);
  font-weight: 800;
}
```

Secondary CTA:

```css
.button-secondary {
  background: transparent;
  color: var(--color-text);
  border: 1px solid rgba(199, 255, 26, 0.55);
}
```

### **Highlights**

Use bright colors sparingly:

- primary actions: `#C7FF1A`
- momentum/fire: `#FF6B1A`
- community: `#9B5CFF`
- encouragement/megaphone: `#2F8CFF`
- warnings/flag: `#FF6B1A`

Do not use gradients on buttons.

### **Header and bottom nav**

Header:

```css
.app-header {
  background: rgba(8, 13, 11, 0.92);
  border-bottom: 1px solid var(--color-border-dark);
  color: var(--color-text);
}
```

Bottom nav:

```css
.bottom-nav {
  background: rgba(8, 13, 11, 0.96);
  border-top: 1px solid var(--color-border-dark);
}
```

Active nav state:

```css
.bottom-nav .active {
  color: var(--color-primary);
}
```

### **Logo / wordmark**

Use Bungee for the wordmark:

```css
.wordmark {
  font-family: var(--font-display);
  color: var(--color-text);
  letter-spacing: 0.02em;
}
```

Keep the existing “G” app icon, but switch it to:

```css
.logo-mark {
  background: var(--color-primary);
  color: #07100C;
}
```

### **Final constraint**

Keep the implementation CSS-focused and low-risk. Do not redesign flows. Do not add new features. Do not introduce animation libraries.

## Stage 5.2 Navigation restructure
Update the bottom navigation so goal creation is no longer a primary nav item.
### Required bottom nav items
The bottom navbar should contain exactly:
1. **My Goals**
   - Existing destination stays as-is.
   - This remains the user’s main personal goals page.
   - Do not add “New Goal” to the navbar.
   - Goal creation should remain available only through the CTA already present on the My Goals screen.
2. **My Cheers**
   - New or existing personal evidence/cheers view.
   - Purpose: show all evidence posts uploaded by the current user in one place.
   - Each evidence item should show its received cheer count.
   - This is not for browsing other users’ evidence.
3. **All Cheers**
   - Rename the current **All goals** nav item/page concept to **All Cheers**.
   - This page should continue to behave like the current “All goals” feed:
     - show evidence posts from all users
     - show each evidence item with its respective cheers
     - preserve existing feed functionality
### URL change required
The current `/all-goals` route was a naming mistake.
Change it to:
```txt
/all-cheers

Requirements:

* Update the route folder/file from /all-goals to /all-cheers.
* Update all internal links/navigation references.
* Update active nav state logic so /all-cheers highlights All Cheers.
* Remove or replace any user-facing label that says All goals.
* Do not change the underlying page functionality unless required by the route rename.

Remove New Goal from navigation

* Remove New Goal from the bottom navbar entirely.
* Do not create an alternate nav item for it.
* Do not add a floating action button.
* The intended creation path is the CTA inside My Goals only.

Acceptance criteria

* Bottom navbar shows only: My Goals, My Cheers, All Cheers.
* /all-cheers works and displays the same feed previously shown at /all-goals.
* No visible nav item says New Goal.
* No visible nav item says All goals.
* The My Goals CTA remains the only obvious way to create a new goal.



---

# Total Estimated Time

Approximately 14 hours total (includes Stage 3.5 photo upload).

This estimate assumes:

- heavy use of Cursor/LLMs
- aggressive scope control
- reuse of known patterns
- prioritizing happy-path implementation
- minimal custom backend complexity

---

# Session Milestone Plan

## By Session 10 (Work In Progress)

Target:

- deployed app exists
- Neon + auth connected
- auth working
- one complete vertical slice working:
create goal → create post → see in feed

Stretch Goal:

- evidence photo upload working (Stage 3.5)
- cheers working

---

## By Session 12 (Presentation)

Target:

- all MVP features functional (including evidence photos via Netlify Blobs)
- deployed production URL stable
- photo uploads verified in production
- responsive UI polished
- second-account social demo working
- presentation/demo ready

---

# Initial Build Order

## Infrastructure First

1. Scaffold SvelteKit project
2. Push repo to GitHub
3. Deploy immediately to Netlify
4. Verify production deploy pipeline

---

## UI Shell

1. Build landing page
2. Build auth screens
3. Build My Goals layout
4. Build hardcoded goal cards
5. Build hardcoded feed UI

---

## Backend Foundation

1. Configure Neon `DATABASE_URL` and Better Auth env vars
2. Define Drizzle schema for app tables
3. Push schema to Neon
4. Wire Better Auth on login/signup
5. Add protected route guards
6. Enforce server-side authorization rules in CRUD (Stage 3)

---

## Core Product Loop

1. Create goals in database
2. Create evidence posts in database (text + goal; Stage 3)
3. Load real feed data
4. Protect authenticated routes
5. Validate ownership/security constraints

---

## Evidence Photos (Stage 3.5)

1. Enable Netlify Blobs on site
2. Add upload form action + `@netlify/blobs`
3. Migrate schema/UI from stamps to `photo_url` / `photo_key`
4. Render photos in feed; verify production uploads

---

## Social Features

1. Add cheers
2. Add cheer toggling
3. Add post flagging

---

## Polish

1. Improve loading states
2. Improve empty states
3. Responsive polish
4. Final visual cleanup
5. Demo preparation/testing

---

# Manual Acceptance Tests

## Authentication

- User can sign up
- User can log in
- User session persists after refresh

---

## Goals

- User A can create a goal
- User A can edit/delete their own goal
- User B cannot edit/delete User A's goal

---

## Evidence Posts

- User A can create evidence post with photo + text
- Photo displays in public feed (`photo_url` from Netlify Blobs)
- Invalid file type or oversized file is rejected
- User B cannot edit/delete User A's evidence post
- User B cannot attach evidence to User A's goal ID
- User A deleting their post removes the blob (best-effort)

---

## Cheers

- User B can cheer User A's post
- Second click removes cheer
- Duplicate cheers are prevented
- User B cannot forge a cheer belonging to User A

---

## Flags

- User B can flag User A's post
- Duplicate flags are prevented
- User B cannot forge a flag belonging to User A

---

## Security

- Unauthenticated users cannot access protected routes
- Server actions reject unauthorized writes (wrong user_id or foreign goal_id)
- Users cannot modify another user's records directly through API calls

---

# Biggest Risks

## Scope Creep

Risk:
Trying to build a full social platform instead of a focused MVP.

Mitigation:
Keep the app centered around one core loop:

- create goal
- post evidence
- receive reinforcement

---

## Authentication Complexity

Risk:
Auth/session bugs consuming too much time.

Mitigation:
Use Better Auth defaults already scaffolded.
Copy patterns from demo routes.
Avoid custom token logic.

---

## File Upload / Netlify Blobs

Risk:
Upload works locally but fails in production; blob env misconfigured; scope creep (cropping, multiple images).

Mitigation:
Complete Stage 3 text loop first, then Stage 3.5.
Verify uploads on Netlify deploy before Stage 4.
Enforce strict MIME/size limits server-side.
One photo per post; no editor.

---

## Overbuilding Gamification

Risk:
Spending too much time on points, streaks, and systems.

Mitigation:
Focus on emotional reinforcement first.
Gamification can remain lightweight.

---

# Product Principles

## 1. Lightweight participation

Posting progress should feel fast and easy.

## 2. Positive reinforcement

The app should feel encouraging, not judgmental.

## 3. Social accountability over productivity optimization

The emotional layer matters more than advanced tracking.

## 4. Visible momentum

Users should feel progress accumulating over time.

---

# Condensed Build Order

1. Scaffold SvelteKit project
2. Build landing page
3. Build My Goals layout
4. Create hardcoded goals/posts (UI shell; stamps are placeholders until 3.5)
5. Add Neon + Better Auth
6. Add auth
7. Create goals in database (Stage 3)
8. Create evidence posts in database — text + goal (Stage 3)
9. Build chronological feed (Stage 3)
10. Evidence photo upload via Netlify Blobs (Stage 3.5)
11. Deploy; verify Blobs in production
12. Add cheers (Stage 4)
13. Add flagging (Stage 4)
14. Polish UI (Stage 5)

---

# Open Questions

## Product Questions

- What creates emotional momentum earliest?
- How much reinforcement is enough before gamification becomes unnecessary?
- Should future versions support private accountability groups?

## Technical Questions

- Best structure for feed queries as scale increases?
- Should future versions support real-time updates?
- Should future versions add notifications/email reminders?
- Should future versions use direct-to-blob browser uploads for larger files (bypass serverless body limits)?

## UX Questions

- How do we make posting feel lightweight (photo + caption without friction)?
- How do we avoid the app feeling performative or “cringe”?
- What default crop/aspect ratio keeps the feed cohesive?

---

# Definition of Success

The project succeeds if:

- users can publicly commit to goals
- users can post evidence of progress **with photos** others can see
- other users can validate that progress (cheers)
- the app creates a feeling of accountability and momentum

Even with minimal gamification systems.