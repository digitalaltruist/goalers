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

- Supabase
  - Auth
  - PostgreSQL database

## Deployment

- Netlify

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

- dashboard
- create goal flow
- create evidence flow
- activity feed
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

The MVP will not support image uploads.

Instead, users choose from a small set of curated evidence visuals, such as:

- stamps
- emoji clusters
- lightweight illustrations/icons

The selected value is stored as a string slug in `visual_stamp`.

Example values:

- `book`
- `workout`
- `study`
- `code`
- `healthy_meal`

This keeps posting lightweight, avoids Supabase Storage complexity, and makes the feed feel more designed.

Tradeoff:
This is less useful as photographic proof, but it lowers friction and teaches users what kinds of evidence are expected.

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

- users can flag evidence posts
- flags are stored in the database
- no moderation workflow is built yet
- no automated spam detection exists

Flags are effectively invisible operationally in MVP because no admin tooling exists yet.

This is enough to acknowledge the abuse vector without overbuilding moderation systems.

---

# Threat Model / Abuse Assumptions

The MVP protects against:

- unauthorized database writes through RLS
- users modifying other users' content
- duplicate cheers
- forged authenticated requests through Supabase auth

The MVP does NOT protect against:

- spam accounts
- coordinated abuse
- offensive text content
- fake accountability claims
- high-volume scraping
- moderation backlog

This is acceptable for a small-scale capstone demo.

---

# MVP Scope

The capstone version will remain intentionally small and focused.

## Core Features

- user authentication
- create goals
- create evidence/progress posts
- chronological public feed
- lightweight reactions/validation
- basic evidence flagging

## Nice-to-Have

- simple streak display
- avatars/profile images
- improved feed polish

## Explicitly Out of Scope

- accountability circles/groups
- notifications
- team competitions
- leaderboards
- advanced gamification
- real-time systems
- image uploads
- follower systems
- private goals

---

# Core Data Models

## auth.users

Managed directly by Supabase Auth.

Stores:

- authentication identity
- email
- password credentials

The MVP will use Supabase Auth as the source of truth for email addresses.

Emails will NOT be duplicated in `profiles` to avoid synchronization drift.

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
  - foreign key referencing `auth.users.id`
- username must be unique
- username is selected during onboarding after signup
- usernames are publicly visible

Profile rows are automatically created after signup.

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
- visual_stamp
- created_at

Notes:

- `visual_stamp` stores predefined string slugs
- all evidence posts are public to authenticated users

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

# Row Level Security (RLS)

Supabase Row Level Security will be enabled on all tables.

---

## profiles policies

### Read

Authenticated users can read all profiles.

### Insert/Update

Users can only create/update their own profile where:
`profiles.id = auth.uid()`

---

## goals policies

### Read

Authenticated users can read all goals.

### Create

Users can only create goals where:
`goals.user_id = auth.uid()`

### Update/Delete

Users can only modify their own goals.

---

## evidence_posts policies

### Read

Authenticated users can read all evidence posts.

### Create

Users can only create evidence posts where:

- `evidence_posts.user_id = auth.uid()`
- referenced `goal_id` belongs to the authenticated user

This prevents users from attaching evidence to another user's goals.

### Update/Delete

Users can only modify their own evidence posts.

---

## cheers policies

### Read

Authenticated users can read all cheers.

### Create/Delete

Users can only create/remove cheers where:
`cheers.user_id = auth.uid()`

This prevents forged cheer ownership.

---

## post_flags policies

### Create

Users can only create flags where:
`post_flags.user_id = auth.uid()`

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
The project depends on cloud services (Supabase + Netlify). Deploying early reduces integration risk and avoids discovering auth/environment issues late in development.

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

# Stage 2 — Supabase Foundation

Goal:
Establish the real backend infrastructure and authentication layer.

Tasks:

- create Supabase project
- configure environment variables
- configure local + production redirect URLs
- install Supabase client libraries
- configure auth/session handling
- create database schema
- enable RLS on all tables
- create initial RLS policies
- connect deployed frontend to Supabase

Technical Notes:

- Use Supabase Auth as source of truth for identity
- Use `@supabase/ssr` recommended SvelteKit integration pattern
- Verify auth behavior in BOTH localhost and deployed production environment

Important:
Do not continue until authentication works reliably in production.

Success Criteria:

- users can sign up
- users can sign in
- auth persists after refresh
- production deployment communicates with Supabase correctly
- protected routes work
- database tables exist
- RLS policies are active

Estimated Time:
~3 hours

---

# Stage 3 — Core Vertical Slice

Goal:
Implement the complete core product loop end-to-end using real data.

Core Loop:
create goal → create evidence post → see post in feed

Tasks:

- create goals table integration
- create evidence posts integration
- create dashboard data loading
- create public chronological feed
- create protected create flows
- connect forms to database
- implement CRUD operations
- validate ownership/security rules

Notes:
This is the first fully functional version of Goalers.

Priority:
Functionality over polish.

Success Criteria:

- authenticated users can create goals
- authenticated users can create evidence posts
- evidence posts persist in database
- feed loads real data
- users only modify their own records
- RLS prevents unauthorized writes

Estimated Time:
~3 hours

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
This stage transforms the product from a CRUD app into a social accountability experience.

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

Tasks:

- typography pass
- spacing/layout refinement
- responsive polish
- hover/focus states
- loading states
- empty states
- bug fixes
- cleanup inconsistent UI
- improve perceived product quality

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

---

# Total Estimated Time

Approximately 12 hours total.

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
- Supabase connected
- auth working
- one complete vertical slice working:
create goal → create post → see in feed

Stretch Goal:

- cheers working

---

## By Session 12 (Presentation)

Target:

- all MVP features functional
- deployed production URL stable
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
3. Build dashboard layout
4. Build hardcoded goal cards
5. Build hardcoded feed UI

---

## Backend Foundation

1. Create Supabase project
2. Configure environment variables
3. Configure auth redirect URLs
4. Install/configure Supabase client
5. Add authentication
6. Create database schema
7. Enable RLS policies

---

## Core Product Loop

1. Create goals in database
2. Create evidence posts in database
3. Load real feed data
4. Protect authenticated routes
5. Validate ownership/security constraints

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

- User A can create evidence post
- Post appears in public feed
- Curated visual stamp displays correctly
- User B cannot edit/delete User A's evidence post
- User B cannot attach evidence to User A's goal ID

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
- RLS policies block unauthorized writes
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
Use Supabase Auth defaults.
Avoid custom auth flows.

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

# Initial Build Order

1. Scaffold SvelteKit project
2. Build landing page
3. Build dashboard layout
4. Create hardcoded goals/posts
5. Add Supabase
6. Add auth
7. Create goals in database
8. Create evidence posts in database
9. Build chronological feed
10. Deploy
11. Add cheers
12. Add flagging
13. Polish UI

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

## UX Questions

- How do we make posting feel lightweight?
- How do we avoid the app feeling performative or “cringe”?
- How do curated visuals shape posting behavior?

---

# Definition of Success

The project succeeds if:

- users can publicly commit to goals
- users can post evidence of progress
- other users can validate that progress
- the app creates a feeling of accountability and momentum

Even with minimal gamification systems.