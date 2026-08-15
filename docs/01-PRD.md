

\# Improved PRD (Portfolio MVP v1.1)



\*\*Version:\*\* 1.1 (Production-readiness review)  

\*\*Date:\*\* August 14, 2026  

\*\*Status:\*\* Approved for implementation  

\*\*Context:\*\* Student portfolio project — demonstrate full-stack + AI integration; deployable demo for recruiters  



\---



\## 1. Executive Summary



The AI Travel Planner helps users create personalized, day-by-day travel itineraries from a destination, budget, trip length, and travel style. The app generates attractions, restaurants, hotels, and an estimated cost breakdown. Signed-in users can save and revisit trips.



\*\*Portfolio goal:\*\* Ship a polished, deployable web app that proves auth, persistence, structured AI output, error handling, and thoughtful UX — not commercial scale or booking revenue.



\*\*Demo success criteria (measurable without analytics platform):\*\*

\- End-to-end flow works in a live deployed URL

\- A recruiter can sign in → generate → save → revisit in under 5 minutes

\- README documents architecture, AI approach, known limitations, and cost estimate



\---



\## 2. Goals \& Non-Goals



\### Goals

\- Reduce trip planning friction via one guided input flow

\- Tailor suggestions to budget and travel style

\- Show transparent \*\*estimated\*\* costs with clear disclaimers

\- Persist trips per authenticated user



\### Non-Goals (v1)

\- Booking, payments, or affiliate revenue

\- Live pricing from external APIs

\- Native mobile apps

\- Multi-user collaboration

\- Legal travel advice (visa, safety, health)

\- Production SLA, multi-region deployment, or enterprise auth



\---



\## 3. Target Users (Simplified)



\### Primary: Budget Explorer (Alex, 26, solo)

Wants a fast, affordable plan without research overload. \*\*MVP optimized for this user.\*\*



\### Secondary: Occasional Traveler (David, 45)

Needs simple UI, clear labels, trustworthy disclaimers. \*\*Informs accessibility and copy requirements.\*\*



\### Internal: Portfolio Reviewer

Needs a working demo, clean UI, and obvious AI value in one session. \*\*Informs demo/sample itinerary and README quality bar.\*\*



\*Other personas (Family, Luxury, Adventurer) inform travel-style labels and prompt tone — not separate feature sets in v1.\*



\---



\## 4. User Flows



\### 4.1 Happy path — Create \& save



```

Landing → Sign in → New Trip form → Confirm summary → Generate (loading) → Itinerary view → Save → My Trips → Open saved trip

```



\### 4.2 First-time user

```

Landing → "See sample itinerary" (no auth) OR Sign up → Empty "My Trips" state with CTA → New Trip

```



\### 4.3 Error paths (required)

| Trigger | Behavior |

|---------|----------|

| Invalid form | Inline errors; no API call |

| LLM timeout/failure | Retry once automatically; then user-facing error + "Try again" (preserves inputs) |

| Invalid LLM JSON | Retry with repair prompt once; then fail gracefully |

| Save fails | Toast error; itinerary remains on screen; retry save |

| Session expired | Redirect to sign-in; return URL preserves intent (not partial form if avoidable) |

| Over budget itinerary | Show plan + prominent warning; do not block viewing |



\### 4.4 Authentication policy (decided)

\- \*\*Must sign in to generate and save\*\* (controls LLM cost abuse)

\- \*\*Sample/demo itinerary\*\* on landing is static or cached — no LLM call — so reviewers see value before sign-up



\---



\## 5. Functional Requirements



Priority: \*\*P0\*\* = v1 required, \*\*P1\*\* = v1.1 if time permits, \*\*P2\*\* = post-portfolio



\### 5.1 Authentication \& Account



| ID | Requirement | Priority |

|----|-------------|----------|

| FR-1 | Sign in via \*\*Google OAuth\*\* OR email/password (pick one primary; second is P1) | P0 |

| FR-2 | Persistent session across browser restarts | P0 |

| FR-3 | Sign out | P0 |

| FR-4 | Sign-in required before generate/save | P0 |

| FR-5 | Accept Terms + Privacy checkbox on first sign-up | P0 |

| FR-6 | Password reset | P2 |

| FR-7 | Delete account and all associated trips | P1 |



\### 5.2 Trip Input



| ID | Requirement | Priority |

|----|-------------|----------|

| FR-8 | Destination: text input with optional autocomplete (autocomplete P1 if no Places API budget) | P0 |

| FR-9 | Budget: positive number, USD only in v1 | P0 |

| FR-10 | Days: integer, \*\*1–7\*\* (v1 cap — token/cost control) | P0 |

| FR-11 | Travel style: single select — Luxury, Budget, Adventure, Family, Couple, Solo | P0 |

| FR-12 | Client + server validation before generation | P0 |

| FR-13 | Review/confirm screen summarizing inputs | P0 |

| FR-14 | Start date, party size | P2 |



\### 5.3 AI Itinerary Generation



| ID | Requirement | Priority |

|----|-------------|----------|

| FR-15 | Server-side generation only (no client LLM keys) | P0 |

| FR-16 | Output conforms to \*\*defined JSON schema\*\* (see §8) | P0 |

| FR-17 | Day-by-day plan: morning/afternoon/evening activity slots | P0 |

| FR-18 | Each day includes meal suggestions and nightly lodging | P0 |

| FR-19 | Recommendations reflect travel style and budget tier | P0 |

| FR-20 | Aggregate cost breakdown vs user budget | P0 |

| FR-21 | Disclaimer on all pages showing estimates: "AI-generated; verify hours, prices, and availability" | P0 |

| FR-22 | User-initiated full regeneration | P1 (max 1 per trip to control cost) |

| FR-23 | Manual edit of itinerary items | P2 |

| FR-24 | Thumbs up/down on itinerary (stored, no ML loop required) | P1 |



\### 5.4 Content Display



| ID | Requirement | Priority |

|----|-------------|----------|

| FR-25 | Itinerary view: day navigation + sections for Attractions, Restaurants, Hotels, Costs | P0 |

| FR-26 | Attraction: name, description, duration, estimated cost | P0 |

| FR-27 | Restaurant: name, cuisine, price tier ($–$$$), estimated meal cost | P0 |

| FR-28 | Hotel: name, area, tier, nightly rate, trip lodging total | P0 |

| FR-29 | Cost panel: lodging, food, activities, transport, misc, total, delta vs budget | P0 |

| FR-30 | Budget status uses \*\*text + icon\*\*, not color alone | P0 |

| FR-31 | Map links / coordinates | P2 |



\### 5.5 Save \& Retrieve



| ID | Requirement | Priority |

|----|-------------|----------|

| FR-32 | Save trip with auto-title `{Destination} — {N} days` (editable on save P1) | P0 |

| FR-33 | Persist inputs + validated itinerary JSON + cost snapshot + `created\_at` | P0 |

| FR-34 | My Trips list: title, destination, days, style, date | P0 |

| FR-35 | Open saved trip (read-only in v1) | P0 |

| FR-36 | Delete trip with confirmation | P0 |

| FR-37 | Duplicate/rename trip | P2 |



\---



\## 6. AI System Requirements (New Section)



| ID | Requirement |

|----|-------------|

| AI-1 | \*\*Structured output:\*\* LLM must return JSON matching schema; validate with parser (e.g. Zod). Reject invalid responses. |

| AI-2 | \*\*Retry strategy:\*\* On parse failure → one retry with "fix JSON" prompt; on API error → one retry with backoff. |

| AI-3 | \*\*Prompt template versioning:\*\* Store `prompt\_version` on each trip for reproducibility. |

| AI-4 | \*\*Prompt injection defense:\*\* Destination/style fields treated as untrusted data; system prompt instructs model to ignore embedded instructions. |

| AI-5 | \*\*Post-processing validation:\*\* Dedupe POI names across days; cap activities per day (e.g. max 4); flag if total cost exceeds budget >25%. |

| AI-6 | \*\*Token budget:\*\* Target ≤4K output tokens; input capped (truncate if needed). 7-day max enforces this. |

| AI-7 | \*\*Cost control:\*\* Max \*\*3 generations per user per day\*\* (failed attempts don't count after first retry). |

| AI-8 | \*\*No PII in logs:\*\* Log trip\_id, latency, token count, success/fail — not full prompts in production logs. |

| AI-9 | \*\*Safety:\*\* Refuse disallowed destinations/content per provider policy; generic user message on refusal. |

| AI-10 | \*\*Grounding (P1):\*\* Optional Places API to verify top 3 POIs exist; v1 may ship AI-only with stronger disclaimer. |

| AI-11 | \*\*Async generation (P1 if needed):\*\* If hosting HTTP timeout <30s, use job queue + polling or SSE for status. |



\### Itinerary JSON Schema (contract)



```

TripItinerary {

&#x20; destination: string

&#x20; days: DayPlan\[]          // length === user input days

&#x20; hotels: Hotel\[]          // 1+ recommendations

&#x20; costSummary: {

&#x20;   lodging, food, activities, transport, misc, total  // numbers USD

&#x20; }

}

DayPlan {

&#x20; dayNumber: int

&#x20; theme?: string

&#x20; slots: { period: "morning"|"afternoon"|"evening", activity: Activity }\[]

&#x20; meals: { type: "breakfast"|"lunch"|"dinner", restaurant: Restaurant }\[]

}

Activity | Restaurant | Hotel {

&#x20; name, description, estimatedCostUSD, ...

}

```



\---



\## 7. Non-Functional Requirements (Revised)



\### 7.1 Performance (realistic)

| ID | Requirement |

|----|-------------|

| NFR-1 | Generation p95 ≤ 45s (portfolio hosting may be slower; show progress indicator) |

| NFR-2 | Non-generation pages load ≤ 3s on average broadband |

| NFR-3 | Saved trips list ≤ 50 items without pagination |



\### 7.2 Reliability

| ID | Requirement |

|----|-------------|

| NFR-4 | Failed generation never corrupts saved data |

| NFR-5 | Idempotent save (double-click Save doesn't create duplicates — use debounce or disable button) |



\### 7.3 Security (minimum production bar)

| ID | Requirement |

|----|-------------|

| NFR-6 | HTTPS everywhere |

| NFR-7 | LLM API keys server-side only; env vars, never committed |

| NFR-8 | \*\*Authorization:\*\* every trip API checks ownership |

| NFR-9 | Input limits: destination ≤100 chars; budget ≤7 digits |

| NFR-10 | Rate limits: auth (5/min/IP), generation (3/day/user) |

| NFR-11 | Passwords hashed (bcrypt/argon2) if email auth used |

| NFR-12 | CSRF protection if cookie-based sessions |

| NFR-13 | Security headers (CSP baseline, X-Frame-Options) |



\### 7.4 Accessibility (WCAG 2.1 AA — core flows)

| ID | Requirement |

|----|-------------|

| NFR-14 | Keyboard navigable: form, day tabs, save/delete |

| NFR-15 | Visible focus indicators |

| NFR-16 | Form errors linked via `aria-describedby` |

| NFR-17 | `aria-live="polite"` region for generation status and save confirmations |

| NFR-18 | Budget status: text label ("Over budget by $120") + non-color indicator |

| NFR-19 | Semantic headings: h1 trip title, h2 per day |

| NFR-20 | Responsive 320px+; touch targets ≥44px |



\### 7.5 Scalability (portfolio-realistic)

| ID | Requirement |

|----|-------------|

| NFR-21 | Architecture supports \*\*\~50 concurrent users\*\* on free/low-tier hosting |

| NFR-22 | Document expected LLM cost: \~$0.03–0.15 per generation |

| NFR-23 | Stateless app servers; DB for persistence; no Redis required in v1 |

| NFR-24 | If generation exceeds HTTP timeout → async job pattern (P1) |



\### 7.6 Observability (minimal)

| ID | Requirement |

|----|-------------|

| NFR-25 | Server logs: generation success/fail, duration, token usage |

| NFR-26 | README-documents how to run locally and deploy |



\---



\## 8. MVP Scope (Portfolio v1.0)



\### In scope

\- Landing + static sample itinerary

\- Auth (Google OAuth \*\*or\*\* email/password — one method)

\- Trip form: destination, budget (USD), days (1–7), travel style

\- Server-side AI generation with JSON schema validation

\- Itinerary view with day nav + cost breakdown

\- Save / list / view / delete trips

\- Responsive web UI

\- Error handling, loading states, empty states

\- README with architecture diagram



\### Explicitly out of scope (v1)

\- Second OAuth provider, password reset, account deletion

\- Manual itinerary editing, per-day regeneration

\- Places API / maps / live prices

\- PDF export, sharing, email

\- Multi-currency, multi-destination

\- Analytics dashboard, A/B tests

\- 99.9% uptime, horizontal auto-scaling



\### v1.1 (if time permits)

\- One user-initiated regeneration per trip

\- Trip rename on save

\- Thumbs up/down feedback

\- Account deletion

\- Optional Places autocomplete



\---



\## 9. Edge Cases (Expanded)



\### Input \& validation

\- Vague destination ("Europe") → warn; allow proceed with disclaimer

\- Budget too low for luxury + 7 days → warn before generate

\- Zero/negative/non-numeric budget → block

\- Days outside 1–7 → block

\- Empty/whitespace destination → block

\- Unicode/emoji in destination → allow; sanitize for logs



\### AI-specific

\- Invalid/truncated JSON → retry once → error UI

\- Repeated POIs across days → post-process dedupe or merge

\- Physically implausible day (6 cross-town activities) → soft cap in prompt + validation warning

\- Unknown/obscure destination → generate best-effort + low-confidence banner

\- LLM quota/rate limit hit → friendly "try again later" + log alert

\- Prompt injection in destination field → ignored via system prompt; no special UI



\### Auth \& data

\- Session expired on save → re-auth, lose unsaved work (acceptable v1; document limitation)

\- IDOR attempt on trip UUID → 404/403, no leak of existence

\- Double Save click → single record (idempotent)

\- Delete confirmation prevents accidental loss



\### UX

\- Back button during generation → confirm dialog if in progress

\- Empty My Trips → illustration + "Plan your first trip" CTA

\- Very long itinerary → sticky day selector



\---



\## 10. Data Model (Revised)



\*\*User:\*\* `id`, `email`, `auth\_provider`, `created\_at`



\*\*Trip:\*\* `id`, `user\_id`, `title`, `destination`, `budget\_usd`, `days`, `travel\_style`, `itinerary\_json`, `cost\_summary\_json`, `generation\_status`, `prompt\_version`, `feedback` (nullable enum), `created\_at`, `updated\_at`



\*\*Indexes:\*\* `trips(user\_id, created\_at DESC)`



\---



\## 11. Decisions (formerly Open Questions — resolved)



| Question | Decision |

|----------|----------|

| Free generation before sign-in? | \*\*No\*\* — static sample only |

| Max days? | \*\*7\*\* for v1 |

| Currency? | \*\*USD only\*\* |

| Over budget? | \*\*Show plan + warning\*\*, no auto-optimize in v1 |

| Autocomplete required? | \*\*No\*\* — plain text P0; autocomplete P1 |

| Auth method? | \*\*One primary\*\* (Google recommended for portfolio speed) |



\---



\## 12. Acceptance Criteria (v1 Release)



\- \[ ] Deployed public URL loads and sample itinerary visible without sign-in

\- \[ ] User can sign in, submit valid inputs, receive itinerary within 45s or clear error

\- \[ ] Itinerary passes schema validation and displays all five content areas

\- \[ ] Budget comparison shown with accessible text, not color-only

\- \[ ] User can save, sign out, sign in, and view saved trip unchanged

\- \[ ] User cannot access another user's trip

\- \[ ] User can delete a trip

\- \[ ] README covers setup, env vars, AI design, limitations, and estimated run cost

\- \[ ] No API keys in client bundle or git history



\---



\# Major changes and rationale



\## 1. Reframed success metrics for portfolio context

\*\*Change:\*\* Removed 60%/40%/70% product metrics; added deployable demo + recruiter 5-minute test + README quality bar.  

\*\*Why:\*\* A student project won't have Mixpanel/Amplitude. Measurable outcomes should match what you can actually prove in an interview.



\## 2. Reduced personas from five to three (one primary)

\*\*Change:\*\* Kept Budget Explorer as primary; Occasional Traveler for a11y/copy; added Portfolio Reviewer as internal stakeholder.  

\*\*Why:\*\* Five personas implied feature parity the MVP can't deliver. Family/Luxury need filters and curation you won't build. Reviewer persona ensures demo path exists.



\## 3. Added static sample itinerary + decided auth-before-generate

\*\*Change:\*\* Landing shows pre-built sample; LLM generation requires sign-in. Resolved open question #1.  

\*\*Why:\*\* Balances conversion (reviewers see value instantly) with cost/abuse control (LLM calls are expensive and need auth + rate limits).



\## 4. Capped trip length at 7 days (was 14–30)

\*\*Change:\*\* FR-10 / MVP: 1–7 days only.  

\*\*Why:\*\* Fixes contradiction (FR-8 said 30, MVP said 14). Longer trips explode token usage, increase JSON parse failures, and slow generation — bad for free-tier LLM and hobby hosting.



\## 5. Added full AI System Requirements section (§6)

\*\*Change:\*\* New section covering structured JSON, retry strategy, prompt versioning, injection defense, post-validation, token budget, rate limits, logging, safety, optional grounding.  

\*\*Why:\*\* Original PRD treated AI as a black box. Production (and portfolio credibility) requires an explicit contract between app and model. This is the highest-risk subsystem.



\## 6. Defined itinerary JSON schema as API contract

\*\*Change:\*\* Explicit schema in PRD.  

\*\*Why:\*\* Without a schema, frontend/backend/LLM can't integrate reliably. Schema validation is how you turn "AI feature" into "engineered feature."



\## 7. Tightened auth scope

\*\*Change:\*\* One auth method P0 (Google OR email); second provider P1; password reset P2.  

\*\*Why:\*\* Email + Google + Apple + password reset is 2–3 weeks alone. Google-only or email-only is enough to prove auth for a portfolio.



\## 8. Downgraded manual editing and regeneration

\*\*Change:\*\* Manual edits P2; user regeneration P1 (max 1); automatic retry on failure stays P0.  

\*\*Why:\*\* Editing requires CRUD on nested itinerary objects, optimistic UI, and validation — essentially a second app. Retry-on-failure is essential; "try again because I didn't like it" is a cost luxury.



\## 9. Made autocomplete optional (P1)

\*\*Change:\*\* Plain text destination P0; Places autocomplete P1.  

\*\*Why:\*\* Google Places API costs money and adds integration complexity. Free-text works with AI; autocomplete is polish, not core.



\## 10. USD-only currency for v1

\*\*Change:\*\* Resolved open question — USD only.  

\*\*Why:\*\* Multi-currency needs FX rates, locale formatting, and prompt complexity. One currency keeps MVP honest and shippable.



\## 11. Expanded security NFRs to production minimum

\*\*Change:\*\* Added IDOR checks, server-side LLM keys, input limits, rate limits, CSRF, hashing, security headers.  

\*\*Why:\*\* Original PRD mentioned HTTPS and password hashing but missed the most common portfolio-app vulnerabilities: exposed API keys, insecure direct object references, and unbounded LLM spend.



\## 12. Expanded accessibility from one line to nine requirements

\*\*Change:\*\* Keyboard nav, focus, aria-live, aria-describedby, non-color budget indicators, semantic headings, touch targets.  

\*\*Why:\*\* "WCAG 2.1 AA" without specifics isn't implementable. Budget over/under via red/green bar alone fails WCAG 1.4.1.



\## 13. Replaced fantasy scalability with honest limits

\*\*Change:\*\* Removed 10k concurrent and 99.5% SLA; added \~50 concurrent users, LLM cost estimate, optional async jobs.  

\*\*Why:\*\* Claiming 10k concurrency on a portfolio project is non-credible to staff reviewers. Documenting cost-per-generation and timeout workarounds shows architectural maturity.



\## 14. Added Terms/Privacy acceptance

\*\*Change:\*\* FR-5 checkbox on sign-up.  

\*\*Why:\*\* You store user data and send destinations to third-party LLMs. Even a portfolio app should acknowledge privacy — and it signals product thinking in reviews.



\## 15. Added feedback (thumbs up/down) as P1

\*\*Change:\*\* Simple feedback field on trip, no ML loop.  

\*\*Why:\*\* Shows you thought about quality measurement without building a fine-tuning pipeline.



\## 16. Idempotent save and generation status on Trip model

\*\*Change:\*\* `generation\_status`, debounced save, indexes.  

\*\*Why:\*\* Prevents duplicate trips from double-clicks and clarifies partial-failure states — common bugs in AI apps.



\## 17. Expanded edge cases for AI failure modes

\*\*Change:\*\* Invalid JSON, token limits, quota exhaustion, dedupe, implausible schedules, injection.  

\*\*Why:\*\* Original edge cases focused on form validation; AI apps fail differently from CRUD apps. Interviewers will ask "what if the model returns garbage?"



\## 18. Resolved all open questions into decisions table

\*\*Change:\*\* §11 decisions — no open questions blocking build.  

\*\*Why:\*\* Open questions are fine for stakeholder workshops; bad for a solo builder starting implementation.



\## 19. Postponed features that were over-engineered for v1

\*\*Postponed:\*\* Map links, PDF export, dietary filters, multi-city, party size, start date, duplicate trip, rename (mostly P2), GDPR export (kept delete as P1), analytics events platform.  

\*\*Why:\*\* Each adds integration surface area without improving the core portfolio narrative: \*inputs → AI → structured output → persist → retrieve\*.



\## 20. Updated acceptance criteria to be verifiable

\*\*Change:\*\* Added IDOR test, no keys in client, README requirements, sample itinerary without auth.  

\*\*Why:\*\* Original checklist was feature-focused; revised checklist is what a staff engineer would use to approve a demo deployment.



\---



\## What stayed the same (and was already strong)



\- Core user journey (sign in → inputs → generate → view → save → revisit)

\- Six travel styles as prompt modifiers (cheap to implement, high personalization signal)

\- Cost breakdown vs budget (key differentiator)

\- Clear non-goals around booking and legal advice

\- Phased roadmap for post-portfolio ambition

\- Disclaimer that estimates aren't live prices



\---



This revised PRD is \*\*implementable in 3–6 weeks\*\* by one developer, \*\*defensible in a staff-level review\*\*, and \*\* honest about AI limitations\*\* — which is exactly what separates a portfolio CRUD app from a portfolio AI product.





