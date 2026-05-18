# Stage 1 Tweaks

## Things I've noticed from the the stage 1 build Cursor created

1. In the demo logged in experience, the A icon meant to represent the user's profile
- Should be right aligned with the right margin
- Instead of A it should be AR (user's initials) and it should have a profile icon next to it.
- When clicked/tapped, user should see the option to "Log out"
2. "Posting evidence" is the most important action for users, if not the most common which should be cheers. To make it omnipresent and easy, there should be a floating action button in the lower right hand corner with a "+" that opens /evidence/new
3. "Dashboard" should be changed to "My Goals" both at a UX copy level as at a code level (my-goals)

5. In the current "Feed,
 - "Jamie Chen" and the other posters have a hands up emoji in the cheer button, but "Sam Okonkwo" has a clapping emoji. The same emoji should be used for both.
 - "Flag" is a necessary but less important action. Reduce its prominence by moving it to the right bottom corner of the evidence card and changing to the icon of a flag. Emoji is fine.
 -"Feed" should be changed to "All Goals" both at a UX copy level as at a code level (all-goals)

## Follow up
## When users tap on the + floating button

- They are taken to the new goal page. The navigation should reflect this and "New goal" should be selected in the bottom nav bar.
- the floating button should NOT be visible when I am in evidence/new as tapping it would take me to the page I'm already in.

## Flag issues
The flag in the evidence card in all-goals is making the card taller than it needs to be. It should be vertically aligned with the "Cheer" button. Also, replace the icon you are using for a flag with this ascii symbol  ⚑

## Color palette

The color palette is looking like a copy of lovable. Redesign the visual palette and styling system for this app.

### Current issue
The UI feels too close to the default Lovable/Tailwind beige-and-orange aesthetic. It looks generic AI-generated SaaS.

### Goal:
Create a fresher, more distinctive palette inspired subtly by football/soccer culture and performance psychology — but avoid anything too literal, childish, or “sports app” cliché.

### Design direction:
- Think premium football culture, not FIFA Ultimate Team
- Inspired by:
  - pitch/turf greens
  - dark stadium tones
  - off-white kit fabrics
  - muted training gear palettes
  - editorial sports photography
- The app should feel:
  - disciplined
  - motivating
  - social
  - energetic
  - slightly competitive
  - modern and premium

### Avoid:
- generic orange CTA everywhere
- startup beige UI
- bright saturated greens
- neon sports branding
- “gaming app” aesthetics
- gradients everywhere

### Palette guidance:
- Primary: deep moss / pitch green / forest green
- Secondary neutrals: warm off-whites and soft graphite
- Accent: restrained amber or electric lime used VERY sparingly
- Cards should feel cleaner and more premium
- Improve contrast and visual hierarchy

### Styling updates:
- Rework buttons, chips, badges, and navigation to fit the new palette
- Add subtle depth and tension using shadows/borders
- Make goal cards feel more like “commitment objects”
- Keep accessibility and readability high
- Preserve the current layout structure

### Important:
Do NOT redesign functionality.
Only redesign visual language, color system, typography weight usage, spacing polish, and component styling consistency.