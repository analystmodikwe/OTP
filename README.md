# OTP Security System

A small API + frontend for generating and verifying one-time passcodes (OTPs), built as a technical assessment for Melsoft Academy.

This is not a login system — there's no user accounts or sessions here. It's just two things: a backend that can generate an OTP for an email address and check whether a submitted code is valid, and a frontend to actually exercise that API so you can see it working.

## What's in here

The project is split into two folders:

- `backend/` — a Node + Express + TypeScript API that handles all the OTP logic
- `frontend/` — a React + TypeScript app with two screens: one to request/resend an OTP, and one to verify a code

There's no database. All OTP state lives in memory on the server, which is fine for this assessment but obviously wouldn't survive a server restart or scale across multiple instances in a real production setup.

## Running it locally

You'll need Node installed. Then, in two separate terminals:

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

The backend runs on `http://localhost:4000`, and the frontend will start on whatever port Vite picks (usually `5174`). Once both are running, open the frontend URL in your browser and you should see the Send OTP screen.

## How the OTP rules work

The brief laid out quite a few rules, and most of the interesting logic is about how they interact. Here's the reasoning behind the implementation:

**Generating a code.** Codes are always 6 digits, zero-padded, so something like `042817` is valid — leading zeros are fine.

**Avoiding repeats.** Before handing out a new code, the backend checks it against that email's history of codes from the last 24 hours. If it happens to land on the same number, it just quietly generates a different one — nothing about that is visible to the user, since the brief was explicit that this shouldn't be noticeable.

**Rate limiting.** Each email can request at most 3 OTPs per hour by default (configurable — more on that below). This check runs before anything else happens, and every request counts toward it, whether it turns out to be a brand-new code or a resend of an existing one.

**Resend vs. new code.** This was probably the trickiest bit to get right. When someone requests an OTP, the backend checks whether there's already an active, unused code for that email that was first sent within the last 5 minutes and hasn't hit the resend cap. If so, it resends that same code and just pushes the expiry out again, rather than generating something new. If none of those conditions hold — no active code, or it's outside the resend window, or it's already been used, or it's hit the max resend count — a fresh code gets generated instead.

**One judgment call worth flagging:** the brief doesn't say explicitly what should happen once an OTP has hit its max resends but the user asks again. I decided that a brand new OTP cycle should start in that case, rather than rejecting the user outright — it seemed like the more sensible behaviour, but it's an assumption rather than something stated directly in the spec.

**Verifying a code.** A submitted code is checked against the currently active OTP for that email. It has to match exactly, not be expired, and not have already been used. Because only one OTP record is ever active per email at a time (a new one always replaces the old), this naturally satisfies "only the latest OTP is valid" without needing extra logic for it.

## Configuration

All the tunable numbers from the brief live in one place, `backend/src/config.ts`, and can be overridden with environment variables:

- `OTP_MAX_REQUESTS_PER_HOUR` — how many OTP requests an email can make per hour (default 3)
- `OTP_EXPIRY_TIME_SECONDS` — how long a code stays valid (default 30)
- `OTP_RESEND_WINDOW_MINUTES` — how long the "resend the same code" window lasts (default 5)
- `OTP_MAX_RESENDS` — how many times a single code can be resent (default 3)

Nothing in the actual logic hardcodes these values — they're all read from this config object, so changing behaviour is just a matter of changing a number (or setting an env var) in one spot.

## API

Two endpoints, both under `/api/otp`:

**`POST /api/otp/send`** — takes `{ "email": "..." }` in the body. Triggers an OTP send (or resend, depending on state) for that email. The actual code isn't returned in the response — it's logged to the server console, standing in for where a real email/SMS provider would send it.

**`POST /api/otp/verify`** — takes `{ "email": "...", "code": "..." }`. Returns `{ "valid": true }` or `{ "valid": false, "reason": "..." }` depending on whether the code checks out.

## Project structure (backend)

The backend logic is split into layers on purpose, so each piece has one job and can be reasoned about on its own:

- `config.ts` — the tunable numbers
- `types.ts` — shared TypeScript shapes for OTP records and results
- `otpStore.ts` — in-memory storage, no business logic, just get/set operations
- `otpService.ts` — all the actual OTP rules, independent of HTTP
- `routes/otpRoutes.ts` — thin Express routes that call into the service layer and translate results into HTTP responses

## Frontend

Two screens, reachable via the nav at the top:

- **Send OTP** — enter an email, click Send. There's also a Resend button that hits the same endpoint; the backend decides internally whether that counts as a resend or a new code.
- **Verify OTP** — enter an email and a code, and it tells you whether that code is currently valid.

Neither screen asks for a password or does any kind of authentication — they're just there to demonstrate the OTP flow works end to end.