# PREGO (React Native / Expo, TypeScript)

Full architecture, folder structure, user flow, and Stitch UI prompts live in
the **PREGO 2.0 Notion doc** — this README is the "how do I run this"
quick reference for when you're back in VS Code.

## Setup

```bash
npm install
cp .env.example .env   # API_URL should point at your running backend
npx expo start
npm run typecheck        # or: npx tsc --noEmit
```

Requires the `prego-backend` project running locally (see its README) or a
deployed URL in `.env`.

## What's actually wired up vs. stubbed

**Working:** root layout auth-guard (`app/_layout.jsx`), sign-in screen wired
to `useAuthStore`, the shared `apiClient` with token attach + silent refresh,
`trimesterCalc.js` (ported from the original Java logic), home screen pulling
`/patients/me`.

**Stubbed (placeholder screens, build from the Stitch prompts in Notion Phase
10):** sign-up, pregnancy-log, doctors, gallery, profile, and the entire
`(doctor)` and `(hospital-admin)` route groups — these don't exist yet, add
them alongside `(patient)` following the same `_layout.jsx` + tab pattern.

## Rules to keep as you build more screens

1. **Never call `fetch`/`axios` directly from a screen.** Add a function to
   the relevant file in `services/`, call that from the screen via
   `useQuery`/`useMutation`.
2. **Tokens only ever live in `expo-secure-store`**, never `AsyncStorage`,
   never component state.
3. **Every permission (camera, photos, notifications, location) is requested
   just-in-time**, at the moment the user taps the relevant action — not on
   app launch. See Notion Phase 8 for why this matters for store approval.
4. Logout must call `authService.signOut()` — it clears both local tokens
   AND revokes the refresh token server-side. Never just clear local state.

## Theming

`constants/theme.ts` exports `lightTheme`/`darkTheme` (typed via the `Theme`
interface) and `hooks/useTheme.ts` picks between them based on
`useColorScheme()`, with an optional override for a manual toggle. Wire a
toggle into `settings.tsx` once it exists, persist the chosen preference with
`AsyncStorage` (not `expo-secure-store` — it's a UI preference, not a
credential), and pass it as `useTheme(storedPreference)`.

## Next screens to build, in order

1. `sign-up.jsx` (role toggle: patient/doctor) + `verify-otp.jsx`
2. `pregnancy-log.jsx` (symptom form + history chart)
3. `doctors.jsx` + doctor profile + booking flow
4. `chat/[doctorId].jsx` (Socket.IO client, pairs with backend's chat module)
5. `gallery.jsx` (signed upload/download flow against `/media` endpoints)
6. `settings/security.jsx` (active sessions list, MFA toggle, logout)
