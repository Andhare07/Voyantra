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



\# 28. Where We Are Right Now



Current project state:



```text

&#x20;                   VOYANTRA



PRD

✅ Complete



Design System

✅ Complete

Aurora Atlas



Architecture

✅ Complete

Approved



Database Design

⏳ Next



API Design

⏳ Later



User Flows

⏳ Later



Component Architecture

⏳ Later



Coding Standards

⏳ Later



Testing Strategy

⏳ Later



Development

⏳ Not started

```



\---



\# 29. What We Have Learned So Far



Although no application code has been written yet, the planning phase has already introduced several important engineering concepts:



\### Product Development



\* PRDs

\* MVPs

\* Scope management

\* Personas

\* User flows

\* Functional requirements

\* Non-functional requirements

\* Acceptance criteria



\### Software Architecture



\* Monoliths

\* BFF architecture

\* Layered architecture

\* Separation of concerns

\* Service layers

\* API design

\* Server vs Client Components



\### AI Engineering



\* Structured outputs

\* JSON schemas

\* Prompt versioning

\* Prompt injection

\* Validation

\* Retry strategies

\* Token management

\* Rate limiting

\* AI hallucination mitigation



\### Backend \& Data



\* PostgreSQL

\* JSONB

\* Database relationships

\* Authentication vs authorization

\* RLS

\* API ownership checks

\* Caching

\* Persistence



\### DevOps / Deployment



\* Environment variables

\* Vercel

\* Preview deployments

\* Production deployments

\* CI

\* Serverless limitations



\### AI-Assisted Development



Most importantly, we've started developing a workflow for using AI responsibly:



```text

We define the requirements

&#x20;       ↓

AI helps design

&#x20;       ↓

We review the design

&#x20;       ↓

AI implements

&#x20;       ↓

We review the implementation

&#x20;       ↓

AI tests / fixes

&#x20;       ↓

We understand what changed

```



The goal is not:



> "Make AI build my app."



The goal is:



> \*\*"Use AI as an engineering teammate while I learn how the system works."\*\*



\---



\# 30. Current Development Philosophy



The guiding principle for Voyantra is:



> \*\*Plan first. Build in small blocks. Understand every important decision. Test continuously. Keep the architecture simple until complexity is justified.\*\*



Voyantra is our first real multi-page, multi-feature application. It is intended to establish the engineering habits that will later be used to build significantly more ambitious projects.



\---



\# 31. Next Stage



The next stage is:



\## Database Design



Before writing application code, we will define exactly:



\* What data exists

\* How it is structured

\* How users relate to trips

\* What the itinerary JSON looks like

\* What indexes are required

\* How ownership works

\* What data is stored and why



Once that is finalized, we can move toward API design and eventually implementation.



