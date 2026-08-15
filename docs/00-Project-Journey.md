\# Voyantra — Project Journey

\*\*Project:\*\* Voyantra

\*\*Type:\*\* AI-powered travel planner

\*\*Purpose:\*\* Learning + portfolio project

\*\*Started:\*\* August 2026

\*\*Current Stage:\*\* Architecture approved; implementation not yet started

\---

\# 1. Why We Started Voyantra

Voyantra is our first serious project with multiple pages, features, APIs, authentication, AI integration, database persistence, and deployment.

The purpose is \*\*not to make Voyantra the ultimate project in the portfolio\*\*.

Instead, Voyantra is our first project designed to teach the complete modern software-development workflow:

> Idea → Requirements → Design → Architecture → Development → Testing → Deployment

The project is intended to become a polished portfolio piece while primarily teaching how a larger application is planned and engineered.

\---

\# 2. The Original Product Idea

The initial concept was:

> \*\*AI Travel Planner\*\*

> Pick a destination and budget, then generate a complete trip with places to visit, restaurants, and a day-by-day itinerary. Save trips for later.

The initial feature set included:

\* Sign in

\* Destination input

\* Budget input

\* Number of days

\* Travel style

\* AI-generated itinerary

\* Attractions

\* Restaurants

\* Hotels

\* Estimated costs

\* Saving trips

\* Viewing saved trips later

\---

\# 3. The First Important Lesson — Don't Start by Prompting "Build This"

Before starting development, we established the workflow from an AI-development workshop:

Instead of:

> "Build me an app."

the development process should be:

```text

Define the product

&#x20;       ↓

Design the experience

&#x20;       ↓

Break the application into parts

&#x20;       ↓

Design the architecture

&#x20;       ↓

Build one block at a time

&#x20;       ↓

Review the code

&#x20;       ↓

Test

&#x20;       ↓

Debug

&#x20;       ↓

Refactor

```

The AI should act as a developer working from clear requirements rather than being expected to invent the entire application independently.

\---

\# 4. PRD v1.0

Our first major artifact was the \*\*Product Requirements Document\*\*.

The first PRD defined:

\* Executive summary

\* Problem and solution

\* Goals and non-goals

\* User personas

\* User flows

\* Functional requirements

\* Non-functional requirements

\* MVP features

\* Future roadmap

\* Edge cases

\* Data model

\* Screens

\* Dependencies

\* Open questions

\* Acceptance criteria

The original PRD described Voyantra as a service that turns destination, budget, trip length, and travel style into a structured day-by-day itinerary containing attractions, restaurants, hotels, and estimated costs.

The original PRD was strong conceptually, but it was more like a startup product specification than a realistic first portfolio project.

\---

\# 5. PRD Review and Refinement

Instead of immediately accepting the first PRD, we asked Cursor to review it from the perspective of a:

> \*\*Staff Product Manager + Senior Software Architect\*\*

This was our first real example of using AI to \*\*critique its own work\*\* rather than simply generate content.

The review identified several problems:

\* The original scope was too large for one student.

\* Some requirements contradicted each other.

\* AI reliability was under-specified.

\* Scalability requirements were unrealistic for a portfolio project.

\* Security requirements were incomplete.

\* Important AI failure cases were missing.

\* Several open questions needed to be resolved before implementation.

The review explicitly reframed the project as a student portfolio application rather than a commercial travel platform.

\---

\# 6. PRD v1.1 — Portfolio MVP

The improved PRD became the project's working product specification.

The central goal became:

> Ship a polished, deployable web application demonstrating authentication, persistence, structured AI output, error handling, and thoughtful UX—not commercial scale or booking revenue.

Its success criteria became practical portfolio criteria such as:

\* A working deployed URL

\* A recruiter being able to sign in, generate, save, and revisit a trip within roughly five minutes

\* Documentation covering architecture, AI approach, limitations, and costs

\---

\# 7. Important Product Decisions

The refined PRD made several decisions that narrowed the scope.

\### MVP includes

\* Landing page

\* Static sample itinerary

\* One authentication method

\* Trip creation form

\* Destination

\* Budget

\* Trip duration

\* Travel style

\* Server-side AI generation

\* Structured JSON validation

\* Day-by-day itinerary

\* Cost breakdown

\* Save / list / view / delete trips

\* Responsive UI

\* Loading, error, and empty states

\* Architecture documentation

\### MVP excludes

\* Booking

\* Payments

\* Multi-destination trips

\* Collaboration

\* Native mobile apps

\* PDF export

\* Live pricing

\* Manual itinerary editing

\* Maps

\* Multi-currency

\* Multiple OAuth providers

This made the project realistic for one developer.

\---

\# 8. The AI Became an Engineering Component

One of the biggest changes between PRD v1.0 and v1.1 was how we think about AI.

Instead of:

```text

User → Gemini → Answer

```

Voyantra now treats AI as a subsystem that must be controlled and validated.

The refined requirements introduced:

\* Structured JSON output

\* Schema validation

\* Retry behavior

\* Prompt versioning

\* Prompt-injection defense

\* Post-processing

\* Token limits

\* Generation rate limits

\* Logging

\* Safety handling

\* Optional grounding through Places data

This became one of the central engineering ideas behind Voyantra.

\---

\# 9. Choosing the Product Name

The application was named:

\# \*\*Voyantra\*\*

The name was chosen to give the project a product identity rather than leaving it as "AI Travel Planner."

The intended positioning is:

> A modern AI-powered travel planning product.

The name and brand direction are now fixed for the project.

\---

\# 10. UI/UX Exploration

We then moved into product design.

Rather than immediately coding the interface, we explored six different design directions:

1\. Aurora Atlas

2\. Midnight Meridian

3\. Cartographer

4\. Horizon Ledger

5\. Solstice

6\. Prism Path

These concepts explored different combinations of visual style, information density, typography, cards, animations, landing pages, and dashboards.

The design exploration taught an important lesson:

> AI can describe a visual system extremely well, but description is not the same thing as visual design exploration.

\---

\# 11. Final Design Choice — Aurora Atlas

We selected:

\# \*\*Aurora Atlas\*\*

The final visual direction emphasizes:

\* Premium travel aesthetic

\* Spacious layouts

\* Photography-forward sections

\* Soft atmospheric depth

\* Elegant typography

\* Large-radius cards

\* Subtle shadows

\* Aurora-inspired generation animations

\* Smooth micro-interactions

\* Responsive layouts

Aurora Atlas was selected because it combines the emotional quality of travel with the structure needed for a useful planning interface.

The design direction is now considered fixed.

\---

\# 12. Learning How Multiple AI Tools Can Collaborate

During planning, we discussed an important problem with AI-assisted development:

> If different AIs work on different parts of the project, do we have to repeatedly explain the entire application to each one?

This led to the idea of using \*\*project documentation as shared context\*\*.

Instead of repeatedly writing:

> "Voyantra is an AI travel planner that..."

we create permanent project documents:

```text

docs/

├── PRD

├── Design System

├── Architecture

├── Database

├── API

├── Testing

└── Deployment

```

AI tools can then read the relevant documents instead of receiving the entire project description in every prompt.

This became an important part of our AI-assisted development strategy.

\---

\# 13. Architecture Planning

With the PRD and visual direction established, we moved into architecture.

We specifically decided that the architecture prompt should \*\*not reconsider the product design\*\* because those decisions had already been made.

The architecture instead needed to answer:

> "How should we technically build the product we've already designed?"

\---

\# 14. Current Technology Stack

The architecture is based on the following stack:

\### Frontend

\* Next.js 15

\* React

\* TypeScript

\* Tailwind CSS

\* shadcn/ui

\### Backend

\* Next.js API Routes / Route Handlers

\### Authentication

\* Clerk

\### Database

\* Supabase PostgreSQL

\### AI

\* Google Gemini

\### Places / Location

\* Google Places API

\### Deployment

\* Vercel

For this project, the stack was intentionally fixed rather than turning Voyantra into a technology-selection exercise.

The decision was made because this first project is primarily about learning the software-development workflow and implementing a complete application.

A future project will be used to practice comparing alternative technology stacks before making the decision.

\---

\# 15. Architecture v1.0

Cursor produced the Architecture Design Document on August 15, 2026.

The architecture describes Voyantra as a:

> \*\*Monolithic full-stack web application with a Backend-for-Frontend pattern\*\*

The browser communicates with Next.js, while server-side code communicates with Clerk, Supabase, Gemini, and Google Places.

The browser does not directly hold sensitive Gemini, Places, or Supabase service-role credentials.

\---

\# 16. Architectural Layers

The application is divided into clear responsibilities:

```text

UI

&#x20;↓

API Layer

&#x20;↓

Service Layer

&#x20;↓

Database / External APIs

```

The key principle is:

> Each layer should have a clearly defined responsibility.

For example:

\* React components handle UI.

\* API routes handle HTTP.

\* Services handle business logic.

\* AI modules handle Gemini communication.

\* Database modules handle persistence.

The architecture explicitly keeps route handlers thin and pushes business logic into services.

\---

\# 17. Frontend Architecture

Next.js Server Components are the default.

Client Components are used only where interactivity is required.

Examples:

\### Server-side

\* Landing page

\* My Trips data

\* Initial trip detail

\* Static sample itinerary

\### Client-side

\* Trip form

\* Interactive day navigation

\* Generation loading state

\* Save/delete interactions

\* Animations

\* Interactive controls

The goal is to avoid turning the entire application into one large client-side application.

\---

\# 18. Backend Architecture

The backend follows a layered approach:

```text

API Route

&#x20;  ↓

Authentication

&#x20;  ↓

Validation

&#x20;  ↓

Service

&#x20;  ↓

Database / External API

```

Routes should remain thin.

For example, the generation route should not contain all Gemini logic itself.

Instead:

```text

/api/trips/generate

&#x20;       ↓

generation.service.ts

&#x20;       ↓

Gemini

&#x20;       ↓

validation

&#x20;       ↓

post-processing

```

This improves maintainability and testability.

\---

\# 19. Database Architecture

Voyantra uses PostgreSQL through Supabase.

The main data model contains:

```text

Users

Trips

Generation Logs

Places Cache

```

The generated itinerary is stored as structured JSONB rather than being split into many normalized activity/restaurant/hotel tables.

The reasoning is that an AI-generated itinerary is naturally structured as a single object and will generally be written and read as a complete itinerary.

\---

\# 20. Authentication and Authorization

Clerk is responsible for:

\* Sign-up

\* Sign-in

\* Session management

\* Logout

But authentication and authorization are treated as two separate concepts.

\### Authentication

> Who is the user?

\### Authorization

> Is this user allowed to access this trip?

Every trip lookup must verify ownership using the authenticated Clerk user ID.

This protects against users attempting to access another user's trip by guessing its ID.

\---

\# 21. AI Generation Architecture

The AI pipeline is currently planned as:

```text

User Input

&#x20;   ↓

Client Validation

&#x20;   ↓

Server Validation

&#x20;   ↓

Rate Limit

&#x20;   ↓

Sanitize Input

&#x20;   ↓

Build Prompt

&#x20;   ↓

Gemini

&#x20;   ↓

Parse JSON

&#x20;   ↓

Zod Validation

&#x20;   ↓

Post-process

&#x20;   ↓

Google Places enrichment

&#x20;   ↓

Return itinerary

```

The AI response is treated as untrusted until it passes validation.

The architecture also includes:

\* Prompt versioning

\* Retry handling

\* Invalid JSON recovery

\* Cost control

\* Token optimization

\* Prompt injection prevention

\* Post-processing and deduplication

\---

\# 22. Google Places Integration

Google Places is treated as an \*\*enrichment layer\*\*, rather than the primary source of the itinerary.

The plan is:

```text

Gemini generates itinerary

&#x20;       ↓

Identify important POIs

&#x20;       ↓

Places verifies/enriches them

&#x20;       ↓

Attach coordinates / place IDs / Maps links

```

This means Voyantra can still function if Places fails.

That's an example of graceful degradation.

Places is also planned to be optimized through caching, request limits, and selective enrichment.

\---

\# 23. Trip Persistence

Generated itineraries initially remain ephemeral.

The flow is:

```text

Create Trip Input

&#x20;      ↓

Generate

&#x20;      ↓

Review

&#x20;      ↓

Save

&#x20;      ↓

Database

```

This intentionally avoids creating database records for every abandoned generation.

Saved trips can then be:

\* Listed

\* Opened

\* Deleted

Manual editing and other advanced modifications are postponed.

\---

\# 24. Security Decisions

The architecture includes protection against:

\* Exposed API keys

\* Prompt injection

\* SQL injection

\* XSS

\* CSRF concerns

\* Invalid input

\* Unauthorized access

\* IDOR

\* AI cost abuse

A particularly important rule is:

> Sensitive API keys must remain server-side.

Another important rule is:

> Client validation is never enough; the server validates again.

\---

\# 25. Performance and Scalability

We deliberately avoided pretending that Voyantra needs enterprise infrastructure immediately.

The architecture is designed approximately around:

```text

100 users

&#x20;    ↓

1,000 users

&#x20;    ↓

10,000 users

```

At higher scale, potential changes include:

\* Async generation jobs

\* Redis-based rate limiting

\* Better database scaling

\* Background workers

\* More advanced monitoring

But we explicitly rejected premature infrastructure such as Kubernetes, microservices, CQRS, and event sourcing for this project.

\---

\# 26. The Main Known Architectural Risk

The biggest current concern is:

> \*\*AI generation latency vs serverless execution limits.\*\*

A Gemini request could take longer than the execution window available on a low-tier serverless deployment.

The architecture therefore identifies several possible solutions:

1\. Use a faster Gemini model.

2\. Optimize the generation pipeline.

3\. Increase the deployment execution limit where available.

4\. Eventually move generation to an asynchronous background job if necessary.

We do \*\*not\*\* need to implement the complex solution immediately.

We simply know the constraint exists before development begins.

\---

\# 27. One Remaining Alignment Note

The architecture introduced an `interests` field to improve itinerary personalization.

The current refined PRD did not explicitly include `interests` as a defined MVP input.

Therefore, before implementation begins, we should decide whether to:

> formally add `interests` to the MVP requirements

or

> remove it until a later version.

The current preference is to add it because it provides significant AI personalization value without introducing major implementation complexity.

This is an alignment issue to resolve rather than an architectural failure.

\---

# 28. Where We Are Right Now

Current project state:

```text
                         VOYANTRA

                           │
                           ▼

                         PRD
                     ✅ Complete

                           │
                           ▼

                    Design System
                     ✅ Complete
                     Aurora Atlas

                           │
                           ▼

                      Architecture
                     ✅ Complete
                       Approved

                           │
                           ▼

                    Database Design
                     ✅ Complete
                    Implemented

                           │
                           ▼

                    API Design
                     ⏳ Next

                           │
                           ▼

                     User Flows
                     ⏳ Later

                           │
                           ▼

               Component Architecture
                     ⏳ Later

                           │
                           ▼

                  Coding Standards
                     ⏳ Later

                           │
                           ▼

                 Testing Strategy
                     ⏳ Later

                           │
                           ▼

                    Development
                  🟡 Beginning
```

The project has now moved from pure planning into the early implementation phase.

The first implemented foundation is the database layer.

---

# 29. Database Foundation — Completed

The database design was implemented using Supabase PostgreSQL.

The approved architecture was translated into an actual database migration:

```text
supabase/
└── migrations/
    └── 20260815000000_initial_schema.sql
```

The migration creates four core tables:

### Users

Stores a minimal mirror of the authenticated Clerk user.

```text
users
├── id
├── email
├── created_at
└── updated_at
```

The `id` corresponds to the Clerk user ID.

---

### Trips

Stores the user's generated and saved trips.

```text
trips
├── id
├── user_id
├── title
├── destination
├── budget_usd
├── days
├── travel_style
├── interests
├── itinerary JSONB
├── cost_summary JSONB
├── generation_status
├── prompt_version
├── feedback
├── created_at
└── updated_at
```

Trips belong to users through:

```text
trips.user_id
        ↓
users.id
```

with cascading deletion.

The itinerary and cost summary are stored as JSONB because their structures are expected to evolve as the AI generation system develops.

---

### Generation Logs

Stores AI generation metadata for rate limiting and observability.

```text
generation_logs
├── id
├── user_id
├── success
├── duration_ms
├── prompt_version
├── error_code
└── created_at
```

This allows the application to later determine:

- how many generations a user has made
- whether generations succeeded
- how long generations took
- which prompt version was used
- why generations failed

---

### Places Cache

Stores cached Google Places data.

```text
places_cache
├── place_id
├── name
├── formatted_address
├── lat
├── lng
├── types
├── cached_at
└── expires_at
```

This exists primarily to reduce repeated Google Places API calls and unnecessary API costs.

The cache is backend-only.

---

# 30. Database Security & Integrity

The database foundation includes several layers of protection.

### Row Level Security

RLS is enabled on:

```text
users
trips
generation_logs
places_cache
```

The MVP architecture uses the Next.js backend with the Supabase service-role client.

Therefore, ownership is primarily enforced at the application layer using the authenticated Clerk user ID.

RLS remains enabled as an additional defense layer and to support possible future direct JWT integration.

---

### Ownership

Trips and generation logs are associated with a specific user:

```text
Clerk User
     │
     ▼
users.id
     │
     ├──────────────► trips.user_id
     │
     └──────────────► generation_logs.user_id
```

Application-level queries must always enforce ownership.

For example:

```text
WHERE user_id = authenticatedClerkUserId
```

A user must never be able to retrieve or modify another user's trips by changing an ID in a request.

---

### Data Integrity

The database contains basic constraints including:

- non-negative trip budgets
- trip duration between 1 and 7 days
- valid travel styles
- valid generation statuses
- valid feedback values
- non-negative generation durations
- required fields
- foreign-key relationships

---

### Indexes

The initial indexes include:

```text
trips
└── (user_id, created_at DESC)

generation_logs
└── (user_id, created_at DESC)

places_cache
└── expires_at
```

These support common access patterns such as:

- retrieving a user's trips
- checking recent generation activity
- maintaining expired Places cache entries

---

# 31. Supabase Integration — Completed

Voyantra now has a Supabase client foundation in:

```text
src/lib/supabase/
├── admin.ts
├── client.ts
└── server.ts
```

The project also contains generated database TypeScript definitions:

```text
src/types/database.ts
```

and the existing trip types have been updated to align with the database foundation.

The Supabase SDK was added to the project:

```text
@supabase/supabase-js
```

---

## Environment Configuration

The following environment variables are required locally:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

Real credentials are stored only in `.env.local`.

`.env.local` is excluded from Git through:

```text
.env.*
!.env.example
```

The repository only contains the variable-name template in `.env.example`.

No secret values are committed to GitHub.

---

## Database Verification

The database connection was tested using the Supabase admin client.

All four tables were successfully accessed:

```text
users              ✅
trips              ✅
generation_logs    ✅
places_cache       ✅
```

The tables currently contain zero rows, which is expected because trip functionality has not been implemented yet.

The temporary connection test file was removed after verification.

---

# 32. Continuous Verification

The database foundation was verified locally using:

```text
npm.cmd run lint
        ↓
       ✅

npm.cmd run typecheck
        ↓
       ✅

npm.cmd run build
        ↓
       ✅
```

The production build successfully compiled all current routes.

The changes were then committed and pushed to GitHub.

GitHub Actions also completed successfully.

Therefore the current repository state is:

```text
Local implementation
       ↓
Local verification
       ↓
Git commit
       ↓
GitHub push
       ↓
GitHub CI
       ↓
       ✅
```

---

# 33. What We Have Learned So Far

Although Voyantra is still early in development, the project has already introduced several important engineering concepts.

### Product Development

- PRDs
- MVPs
- Scope management
- Personas
- User flows
- Functional requirements
- Non-functional requirements
- Acceptance criteria

### Software Architecture

- Monoliths
- BFF architecture
- Layered architecture
- Separation of concerns
- Service layers
- API design
- Server vs Client Components

### AI Engineering

- Structured outputs
- JSON schemas
- Prompt versioning
- Prompt injection
- Validation
- Retry strategies
- Token management
- Rate limiting
- AI hallucination mitigation

### Backend & Data

- PostgreSQL
- JSONB
- Database relationships
- Authentication vs authorization
- Row Level Security
- API ownership checks
- Database indexes
- Caching
- Persistence
- Database migrations

### DevOps / Deployment

- Environment variables
- Secret management
- Git/GitHub
- GitHub Actions
- CI
- Vercel
- Preview deployments
- Production deployments

### AI-Assisted Development

Most importantly, we've developed a workflow for using AI responsibly:

```text
We define the requirements
          ↓
AI helps design
          ↓
We review the design
          ↓
AI implements
          ↓
We review the implementation
          ↓
AI tests / fixes
          ↓
We understand what changed
          ↓
We commit and push
          ↓
CI verifies the repository
```

The goal is not:

> "Make AI build my app."

The goal is:

> **"Use AI as an engineering teammate while I learn how the system works."**

---

# 34. Current Development Philosophy

The guiding principle for Voyantra is:

> **Plan first. Build in small blocks. Understand every important decision. Test continuously. Keep the architecture simple until complexity is justified.**

Voyantra is our first real multi-page, multi-feature application.

It is intended to establish engineering habits that can later be used to build significantly more ambitious projects.

The database stage demonstrated this workflow in practice:

```text
Architecture
     ↓
Database design
     ↓
Migration
     ↓
Supabase setup
     ↓
Local environment
     ↓
Connection verification
     ↓
Lint / Typecheck / Build
     ↓
Git commit
     ↓
GitHub
     ↓
CI
     ↓
✅
```

---

# 35. Next Stage — API Design

The next major planning stage is:

## API Design

Now that the database foundation exists, we can define exactly how the application will communicate with it.

Before implementing trip functionality, we will define:

- API routes
- Request formats
- Response formats
- Authentication requirements
- Authorization rules
- Input validation
- Error responses
- Rate limiting
- Generation lifecycle
- Database interaction boundaries
- AI service boundaries
- Places service boundaries

The goal is to establish a clean contract between:

```text
Frontend
    ↓
Next.js API / Server Layer
    ↓
Application Services
    ├── AI Service
    ├── Places Service
    └── Trip Service
            ↓
        Supabase
```

The API design should be finalized before implementing the major trip-generation functionality.

---

# 36. Immediate Next Objective

The next task is **not** to build the entire trip system.

First we will design the smallest useful API surface for the MVP.

Likely areas include:

```text
Authentication
     ↓
Trip Generation
     ↓
Trip Retrieval
     ↓
Trip Feedback
     ↓
Trip Deletion
```

Each endpoint will be defined with:

```text
Route
Method
Authentication
Request
Validation
Business logic
Database interaction
Response
Error cases
Rate limits
```

Once the API contracts are approved, implementation can begin incrementally.

---

# 37. Current Project Status

As of August 15, 2026:

```text
PRD                     ✅ Complete
Design System           ✅ Complete
Architecture            ✅ Complete
Database Design         ✅ Complete
Database Implementation ✅ Complete
Supabase Connection     ✅ Verified
GitHub Repository       ✅ Synced
CI Pipeline             ✅ Passing

API Design              ⏳ NEXT
User Flows              ⏳ Later
Component Architecture  ⏳ Later
Coding Standards        ⏳ Later
Testing Strategy        ⏳ Later

Major Feature Dev       🟡 Beginning
```

The project has officially transitioned from:

```text
Planning
```

into:

```text
Architecture → Foundation → Incremental Development
```

The next milestone is **API Design**.

```

### One important correction from the old journey

 old section said:

> "Although no application code has been written yet..."

That's no longer true. We now have actual implementation code for the **database foundation, Supabase clients, database types, migration, environment configuration, and CI verification**.

And that's worth documenting because this is exactly the point where Voyantra's development journey changes from **"designing the product"** to **"building the product carefully."** 🚀
```
