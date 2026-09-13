# Solvr — System Architecture

## 1. Overview

Solvr is a full-stack web application built with:

- React + Vite on the frontend
- Spring Boot on the backend
- PostgreSQL for persistent storage
- JWT for stateless authentication
- A rule-based learning engine for mastery calculation
- A revision engine for scheduling problem revisions

The architecture separates presentation, API handling, business logic, persistence, security, and learning calculations.

---

# 2. High-Level Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                       │
│                                                         │
│  React + Vite                                           │
│  ├── Pages                                              │
│  ├── Components                                         │
│  ├── Auth Context                                       │
│  ├── Route Guards                                       │
│  └── API Services / Axios                               │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTP / REST
                          │ Authorization: Bearer JWT
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  Spring Boot Backend                     │
│                                                         │
│  Controllers                                            │
│       ↓                                                 │
│  Services                                               │
│       ↓                                                 │
│  Repositories                                           │
│       ↓                                                 │
│  PostgreSQL                                             │
│                                                         │
│  Security ─────────────── JWT Authentication             │
│  Learning Engine ──────── Mastery Calculation             │
│  Revision Engine ──────── Revision Scheduling             │
│  Exception Handler ────── Structured Errors               │
│  Email Service ────────── Password Reset Mail             │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
                    PostgreSQL
```

---

# 3. Frontend Architecture

The frontend uses React with Vite.

```text
frontend/
└── src/
    ├── api/
    ├── components/
    ├── context/
    ├── hooks/
    ├── pages/
    ├── routes/
    ├── services/
    └── utils/
```

## `pages`

Contains complete screens.

### Authentication

- Login
- Register
- Forgot Password
- Reset Password

### User

- Dashboard
- Problems
- Problem Detail
- Topics
- Topic Detail
- Roadmaps
- Roadmap Detail
- Revision
- Analytics
- Bookmarks
- Favourites
- Profile

### Admin

- Admin Dashboard
- Users
- Problems
- Problem Detail/Form
- Topics
- Topic Detail
- Companies
- Tags
- Roadmaps
- Roadmap Detail

---

## `components`

Reusable interface elements are separated from page-level logic.

Examples:

- Navigation/layout components
- Cards
- Buttons
- Forms
- Search bar
- Pagination
- Modal
- Loading state
- Error state
- Empty state
- Dashboard cards
- Problem cards
- Status/difficulty badges

---

## `services`

API-specific logic is grouped into services.

Current service areas include:

```text
authService
userService
problemService
topicService
companyService
tagService
roadmapService
roadmapProblemService
activityService
reviewService
revisionService
dashboardService
searchService
learningEngineService
adminService
```

This prevents individual pages from containing all API request logic.

---

## `context`

`AuthContext` manages authentication state used throughout the application.

It provides the frontend with the currently authenticated user's session information and authentication actions.

---

## `routes`

The application uses route guards:

```text
ProtectedRoute
AdminRoute
```

`ProtectedRoute` restricts authenticated application routes.

`AdminRoute` restricts administrator-only pages.

Frontend route protection is complemented by backend authorization; the backend remains the final security boundary.

---

# 4. Backend Architecture

The backend package root is:

```text
com.solvr.backend
```

Major packages:

```text
com.solvr.backend
├── config
├── controller
├── dashboard
├── dto
├── entity
├── enums
├── exception
├── learningengine
├── repository
├── revisionengine
├── security
└── service
```

---

# 5. Controller Layer

Controllers expose REST endpoints.

Examples:

```text
AuthController
UserController
ProblemController
TopicController
CompanyController
TagController
RoadmapController
RoadmapProblemController
UserProblemActivityController
ProblemReviewController
RevisionController
SearchController
AdminController
DashboardController
LearningEngineController
```

Controllers primarily:

1. Receive HTTP requests.
2. Validate/request-map input.
3. Call services.
4. Return structured API responses.

The learning-engine controller deliberately contains no formulas.

---

# 6. Service Layer

Services contain application/business logic.

Examples:

```text
AuthService
UserService
ProblemService
TopicService
CompanyService
TagService
RoadmapService
RoadmapProblemService
UserProblemActivityService
ProblemReviewService
AdminService
RefreshTokenService
PasswordResetService
EmailService
```

Specialized services:

```text
dashboard.service
learningengine.service
revisionengine.service
```

---

# 7. Repository Layer

Spring Data JPA repositories provide database access.

Repositories exist for core entities such as:

- User
- Problem
- Topic
- Company
- Tag
- Roadmap
- RoadmapProblem
- UserProblemActivity
- ProblemReview
- RefreshToken
- PasswordResetToken

The service layer uses repositories rather than directly accessing the database.

---

# 8. DTO Layer

DTOs separate API contracts from database entities.

Examples:

```text
RegisterRequest
LoginRequest
LoginResponse
UserProfileResponse
CreateProblemRequest
ProblemResponse
CreateTopicRequest
TopicResponse
CreateRoadmapRequest
RoadmapResponse
CreateUserProblemActivityRequest
UserProblemActivityResponse
CreateProblemReviewRequest
ProblemReviewResponse
```

This prevents entity objects from becoming the API contract.

---

# 9. Security Architecture

Solvr uses stateless Spring Security with JWT.

```text
Login
  ↓
Validate Credentials
  ↓
Generate Access Token
  +
Generate/Store Refresh Token
  ↓
Frontend stores session information
  ↓
API Request
  ↓
Authorization: Bearer <JWT>
  ↓
JwtAuthenticationFilter
  ↓
Extract Email + Role
  ↓
Spring Security Context
  ↓
Controller
```

Passwords are encoded with BCrypt.

The backend uses:

```text
SessionCreationPolicy.STATELESS
```

No server-side HTTP session is required for normal authentication.

---

# 10. Role-Based Authorization

Two application roles exist:

```text
USER
ADMIN
```

Admin endpoints are protected using Spring Security role checks.

Examples:

```java
@PreAuthorize("hasRole('ADMIN')")
```

The HTTP security configuration also protects admin routes.

Authorization is enforced on the backend even if a user manually changes the frontend URL.

---

# 11. Authentication Token Flow

## Access Token

The JWT contains:

- User email as subject
- User role
- Issued-at timestamp
- Expiration timestamp

The current access-token lifetime is approximately 24 hours.

## Refresh Token

Refresh tokens are stored in the database and associated with a user.

When the access token needs refreshing:

```text
Refresh Token
      ↓
Find stored token
      ↓
Check expiration
      ↓
Generate new JWT
```

---

# 12. Password Reset Architecture

```text
Forgot Password
      ↓
Find User
      ↓
Create PasswordResetToken
      ↓
Build Frontend Reset URL
      ↓
Send Email
      ↓
User Opens Link
      ↓
Submit New Password + Token
      ↓
Validate Token / Expiration
      ↓
Hash New Password
      ↓
Delete Reset Token
```

The reset token currently expires after 15 minutes.

---

# 13. Learning Engine Architecture

The learning engine is deliberately separated into multiple stages.

```text
UserProblemActivity
        │
        ├── Status
        ├── Attempts
        ├── Time
        ├── Confidence
        ├── Revision Data
        └── Problem Reviews
                 │
                 ▼
          Normalizers
                 │
                 ├── Status
                 ├── Attempt
                 ├── Time
                 ├── Confidence
                 └── Revision
                 │
                 ▼
           Calculators
                 │
                 ├── Understanding
                 ├── Retention
                 ├── Confidence
                 └── Consistency
                 │
                 ▼
          Mastery Aggregator
                 │
                 ▼
          Mastery Rule Engine
                 │
                 ▼
          Final Mastery Score
                 │
                 ▼
      Persist on UserProblemActivity
```

---

# 14. Learning Engine Components

## Normalizers

Convert raw activity values into normalized scores.

### Status

```text
NOT_STARTED → 0
IN_PROGRESS → 40
SOLVED      → 75
MASTERED    → 100
```

### Attempts

The first attempt receives the highest score, with a penalty for additional attempts.

### Time

Time is compared with the problem's estimated solving time.

### Confidence

The stored 1–5 confidence value is converted to a 0–100 score.

### Revision

Revision count contributes positively while an unresolved revision requirement applies a penalty.

---

# 15. Learning Dimension Calculators

## Understanding

Uses:

```text
Status
Attempts
Time
```

Weights:

```text
Status   → 40%
Attempts → 30%
Time     → 30%
```

## Retention

Uses:

```text
Revision signal
Review quality
Review spacing
```

Weights:

```text
Revision      → 40%
Review quality→ 35%
Spacing       → 25%
```

## Confidence

Measures how closely self-reported confidence matches demonstrated status.

## Consistency

Uses the confidence trend across chronological reviews.

With fewer than two reviews, the consistency score is neutral.

---

# 16. Mastery Aggregation

The four dimension scores are combined as:

```text
Understanding → 35%
Retention     → 30%
Confidence    → 20%
Consistency   → 15%
```

The resulting score is clamped to:

```text
0–100
```

The rule engine then applies state-based rules.

Current rules include:

- `NOT_STARTED` → mastery becomes `0`
- `needRevision = true` → mastery is capped at `70`
- `SOLVED` or `MASTERED` → mastery has a minimum floor of `30`

The final score is persisted on the user's activity.

---

# 17. Revision Engine

The revision engine maintains the next revision date.

Current intervals:

```text
0 → 1 day
1 → 3 days
2 → 7 days
3 → 14 days
4+ → 30 days
```

Revision views are divided into:

```text
OVERDUE
TODAY
UPCOMING
```

The revision service reads only activities belonging to the authenticated user.

---

# 18. Dashboard Architecture

Dashboard data is derived from user activity.

```text
User Activity
     │
     ├── Total Problems
     ├── Solved Problems
     ├── Attempted Problems
     ├── Mastery
     └── Revision
            │
            ▼
      Dashboard Service
            │
            ▼
      Dashboard Response
```

Topic analytics are provided separately through the dashboard module.

---

# 19. Database Interaction

The application uses:

```text
Spring Data JPA
        ↓
Hibernate
        ↓
PostgreSQL
```

Entities define relationships and constraints.

The current application uses Hibernate:

```properties
spring.jpa.hibernate.ddl-auto=update
```

For a more mature production setup, a migration system such as Flyway or Liquibase would be preferable.

---

# 20. Frontend–Backend Communication

The frontend communicates with the backend through Axios services.

Example:

```text
React Page
   ↓
Service
   ↓
Axios API Client
   ↓
HTTP REST Request
   ↓
Spring Controller
   ↓
Service
   ↓
Repository
   ↓
PostgreSQL
```

API responses use the common structure:

```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

---

# 21. Deployment Architecture

```text
User Browser
     │
     ▼
Vercel (Frontend Hosting)
     │
     │ HTTPS API Requests
     ▼
Render (Spring Boot Backend)
     │
     ├──────────────► Neon (PostgreSQL)
     │
     └──────────────► Brevo (Email API)
```

- **Frontend:** Deployed on Vercel as a static Vite build. Since the app uses client-side routing, a `vercel.json` rewrite is required so direct links (e.g. password reset URLs) resolve correctly instead of returning a 404.

- **Backend:** Deployed on Render via Docker. The free tier spins down after inactivity, so the first request afterward can take up to ~50 seconds.

- **Database:** PostgreSQL is provisioned through Neon.

- **Email:** Password reset emails are sent via Brevo's HTTP API rather than SMTP, since Render blocks outbound SMTP ports (25/465/587). Only a verified sender email is required, not a custom domain.

Production configuration is supplied via environment variables:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
FRONTEND_URL
BREVO_API_KEY
BREVO_SENDER_EMAIL
```


---

# 22. Design Principles

The current architecture follows these practical principles:

### Separation of concerns

Controllers, services, repositories, and specialized engines have different responsibilities.

### DTO-based APIs

Database entities are not used as the primary external API contract.

### Stateless authentication

JWT authentication avoids dependence on server-side sessions.

### Explicit learning pipeline

Normalization → calculation → aggregation → rules makes the mastery system easier to inspect and modify.

### Backend authorization

Frontend route protection is not treated as a security boundary.

### Controlled project scope

The current release prioritizes a stable, working DSA platform over speculative AI/ML features.
