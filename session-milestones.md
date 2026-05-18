Session Milestone Plan

By Session 10 (Work In Progress)

Target:





working frontend



database connected



auth working



one end-to-end flow complete:
create goal → create post → see in feed

Stretch Goal:





deployed version live



By Session 12 (Presentation)

Target:





all MVP features working



public deployed URL



responsive UI polished



ready for demo walkthrough



Demo Script





Create account



Create a goal



Post evidence toward the goal



View evidence in public feed



Log in with second account



Cheer the evidence post



Return to first account and see reinforcement



Manual Acceptance Tests

Authentication





User can sign up



User can log in



User session persists after refresh



Goals





User A can create a goal



User A can edit/delete their own goal



User B cannot edit/delete User A's goal



Evidence Posts





User A can create evidence post



Post appears in public feed



Curated visual stamp displays correctly



User B cannot edit/delete User A's evidence post



User B cannot attach evidence to User A's goal ID



Cheers





User B can cheer User A's post



Second click removes cheer



Duplicate cheers are prevented



User B cannot forge a cheer belonging to User A



Flags





User B can flag User A's post



Duplicate flags are prevented



User B cannot forge a flag belonging to User A



Security





Unauthenticated users cannot access protected routes



RLS policies block unauthorized writes



Users cannot modify another user's records directly through API calls



Biggest Risks

Scope Creep

Risk:
Trying to build a full social platform instead of a focused MVP.

Mitigation:
Keep the app centered around one core loop:





create goal



post evidence



receive reinforcement



Authentication Complexity

Risk:
Auth/session bugs consuming too much time.

Mitigation:
Use Supabase Auth defaults.
Avoid custom auth flows.



Overbuilding Gamification

Risk:
Spending too much time on points, streaks, and systems.

Mitigation:
Focus on emotional reinforcement first.
Gamification can remain lightweight.



Product Principles

1. Lightweight participation

Posting progress should feel fast and easy.

2. Positive reinforcement

The app should feel encouraging, not judgmental.

3. Social accountability over productivity optimization

The emotional layer matters more than advanced tracking.

4. Visible momentum

Users should feel progress accumulating over time.



Initial Build Order





Scaffold SvelteKit project



Build landing page



Build dashboard layout



Create hardcoded goals/posts



Add Supabase



Add auth



Create goals in database



Create evidence posts in database



Build chronological feed



Deploy



Add cheers



Add flagging



Polish UI



Open Questions

Product Questions





What creates emotional momentum earliest?



How much reinforcement is enough before gamification becomes unnecessary?



Should future versions support private accountability groups?

Technical Questions





Best structure for feed queries as scale increases?



Should future versions support real-time updates?



Should future versions add notifications/email reminders?

UX Questions





How do we make posting feel lightweight?



How do we avoid the app feeling performative or “cringe”?



How do curated visuals shape posting behavior?