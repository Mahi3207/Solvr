# Solvr — Database Design

## 1. Overview

Solvr uses PostgreSQL as its relational database and Spring Data JPA/Hibernate for persistence.

The database stores:

- Users and roles
- DSA problems
- Topics
- Companies
- Tags
- Roadmaps
- User problem activity
- Problem reviews
- Refresh tokens
- Password-reset tokens

Learning metrics such as mastery are derived from activity and review data, then the current mastery result is persisted on the user activity record.

---

# 2. Entity Relationship Overview

```text
                         ┌──────────────┐
                         │    Topic     │
                         └──────┬───────┘
                                │ 1
                                │
                                │ N
                         ┌──────▼───────┐
              ┌──────────│   Problem    │──────────┐
              │           └──────┬───────┘          │
              │                  │                   │
              │                  │                   │
        M:N   │             M:N  │              M:N │
              ▼                  │                   ▼
       ┌───────────┐             │             ┌───────────┐
       │ Companies │             │             │   Tags    │
       └───────────┘             │             └───────────┘
                                 │
                                 │ 1
                                 │
                                 │ N
                         ┌───────▼───────────┐
                         │ UserProblemActivity│
                         └───────┬───────────┘
                                 │ 1
                                 │
                                 │ N
                         ┌───────▼────────┐
                         │ ProblemReview  │
                         └────────────────┘

┌──────────────┐       1 : N       ┌────────────────────┐
│     User     │──────────────────►│ UserProblemActivity│
└──────┬───────┘                   └─────────┬──────────┘
       │                                     │
       │                                     │ N : 1
       │                                     ▼
       │                              ┌────────────┐
       │                              │  Roadmap   │
       │                              └─────┬──────┘
       │                                    │
       │                                    │ 1 : N
       │                                    ▼
       │                              ┌──────────────┐
       │                              │RoadmapProblem│
       │                              └──────────────┘
       │
       ├──────────────► RefreshToken
       │
       └──────────────► PasswordResetToken
```

---

# 3. Users

### Table

```text
users
```

### Purpose

Stores registered application users and their roles.

### Fields

| Field | Type | Description |
|---|---|---|
| `id` | BIGINT | Primary key |
| `name` | VARCHAR | User name |
| `email` | VARCHAR | Unique user email |
| `password` | VARCHAR | BCrypt password hash |
| `role` | VARCHAR/ENUM | `USER` or `ADMIN` |
| `created_at` | TIMESTAMP | Account creation time |

### Constraints

- Email is unique.
- Password is not stored as plain text.
- Role is represented by the application `Role` enum.

---

# 4. Roles

Roles are represented by the application enum:

```text
USER
ADMIN
```

A role is stored with the user record.

Normal registration creates a `USER`.

Admin creation is intentionally not exposed as a public registration option.

---

# 5. Problems

### Table

```text
problems
```

### Purpose

Stores DSA problem metadata.

### Fields

| Field | Type | Description |
|---|---|---|
| `id` | BIGINT | Primary key |
| `title` | VARCHAR(255) | Problem title |
| `slug` | VARCHAR(255) | Unique problem slug |
| `description` | TEXT | Problem description |
| `difficulty` | VARCHAR/ENUM | Easy, Medium, Hard |
| `platform` | VARCHAR/ENUM | Source platform |
| `problem_url` | VARCHAR/TEXT | External problem URL |
| `estimated_time` | INTEGER | Expected solving time |
| `premium` | BOOLEAN | Whether problem is premium |
| `active` | BOOLEAN | Whether problem is active |
| `topic_id` | BIGINT | Foreign key to topic |
| `created_at` | TIMESTAMP | Creation time |
| `updated_at` | TIMESTAMP | Last update time |

### Constraints

- `slug` is unique.
- `(platform, problemUrl)` is unique.
- Every problem belongs to one topic.

---

# 6. Topics

### Table

```text
topics
```

### Fields

| Field | Type | Description |
|---|---|---|
| `id` | BIGINT | Primary key |
| `name` | VARCHAR | Unique topic name |
| `description` | VARCHAR(500) | Topic description |
| `display_order` | INTEGER | Ordering in UI |
| `active` | BOOLEAN | Active state |
| `created_at` | TIMESTAMP | Creation time |
| `updated_at` | TIMESTAMP | Last update time |

### Relationship

```text
Topic 1 ─────── N Problem
```

---

# 7. Companies

### Table

```text
companies
```

### Fields

| Field | Type | Description |
|---|---|---|
| `id` | BIGINT | Primary key |
| `name` | VARCHAR(100) | Unique company name |
| `active` | BOOLEAN | Active state |
| `created_at` | TIMESTAMP | Creation time |
| `updated_at` | TIMESTAMP | Last update time |

### Relationship

Problems and companies have a many-to-many relationship.

```text
Problem M ───── N Company
```

The relationship is implemented through:

```text
problem_companies
```

---

# 8. Tags

### Table

```text
tags
```

### Fields

| Field | Type | Description |
|---|---|---|
| `id` | BIGINT | Primary key |
| `name` | VARCHAR(100) | Unique tag name |
| `active` | BOOLEAN | Active state |
| `created_at` | TIMESTAMP | Creation time |
| `updated_at` | TIMESTAMP | Last update time |

### Relationship

Problems and tags have a many-to-many relationship.

```text
Problem M ───── N Tag
```

The relationship is implemented through:

```text
problem_tags
```

---

# 9. Problem–Company Join Table

```text
problem_companies
```

Conceptually:

| Column | Purpose |
|---|---|
| `problem_id` | References `problems.id` |
| `company_id` | References `companies.id` |

A problem can be associated with multiple companies.

A company can be associated with multiple problems.

---

# 10. Problem–Tag Join Table

```text
problem_tags
```

Conceptually:

| Column | Purpose |
|---|---|
| `problem_id` | References `problems.id` |
| `tag_id` | References `tags.id` |

This supports reusable problem tags.

---

# 11. Roadmaps

### Table

```text
roadmaps
```

### Fields

| Field | Type | Description |
|---|---|---|
| `id` | BIGINT | Primary key |
| `title` | VARCHAR(255) | Unique roadmap title |
| `description` | TEXT | Roadmap description |
| `level` | VARCHAR/ENUM | Beginner/Intermediate/Advanced |
| `estimated_duration` | INTEGER | Estimated duration |
| `active` | BOOLEAN | Active state |
| `created_at` | TIMESTAMP | Creation time |
| `updated_at` | TIMESTAMP | Last update time |

### Relationship

Roadmaps contain problems through `RoadmapProblem`.

---

# 12. Roadmap Problems

### Table

```text
roadmap_problems
```

This is an explicit association entity rather than a simple many-to-many join because each problem needs an ordering value.

### Fields

| Field | Type | Description |
|---|---|---|
| `id` | BIGINT | Primary key |
| `roadmap_id` | BIGINT | Foreign key to roadmap |
| `problem_id` | BIGINT | Foreign key to problem |
| `display_order` | INTEGER | Position inside roadmap |
| `created_at` | TIMESTAMP | Association creation time |

### Constraint

```text
(roadmap_id, problem_id)
```

is unique.

Therefore, the same problem cannot appear twice in one roadmap.

---

# 13. User Problem Activity

### Table

```text
user_problem_activities
```

This is the central learning/activity table.

### Fields

| Field | Type | Description |
|---|---|---|
| `id` | BIGINT | Primary key |
| `user_id` | BIGINT | Foreign key to user |
| `problem_id` | BIGINT | Foreign key to problem |
| `roadmap_id` | BIGINT | Optional roadmap reference |
| `status` | VARCHAR/ENUM | Problem status |
| `attempt_count` | INTEGER | Number of attempts |
| `time_spent` | INTEGER | Time spent |
| `confidence_level` | INTEGER | User confidence |
| `difficulty_rating` | INTEGER | User difficulty rating |
| `notes` | TEXT | User notes |
| `bookmarked` | BOOLEAN | Bookmark state |
| `favourite` | BOOLEAN | Favourite state |
| `solved_at` | TIMESTAMP | Time problem was solved |
| `next_revision_date` | TIMESTAMP | Scheduled revision |
| `revision_count` | INTEGER | Number of revisions |
| `need_revision` | BOOLEAN | Whether revision is required |
| `mastery_score` | DOUBLE | Latest calculated mastery |
| `last_mastery_calculated_at` | TIMESTAMP | Last mastery calculation |
| `created_at` | TIMESTAMP | Creation time |
| `updated_at` | TIMESTAMP | Last update time |

### Important Constraint

```text
(user_id, problem_id)
```

is unique.

This means one user has one main activity record for a given problem.

---

# 14. Problem Reviews

### Table

```text
problem_reviews
```

### Fields

| Field | Type | Description |
|---|---|---|
| `id` | BIGINT | Primary key |
| `user_problem_activity_id` | BIGINT | Parent activity |
| `status` | VARCHAR/ENUM | Status at review |
| `attempt_count` | INTEGER | Attempts |
| `time_spent` | INTEGER | Time spent |
| `confidence_level` | INTEGER | Confidence |
| `difficulty_rating` | INTEGER | Difficulty rating |
| `need_revision` | BOOLEAN | Revision requirement |
| `mistake_type` | VARCHAR/ENUM | Mistake classification |
| `notes` | TEXT | Review notes |
| `favorite_attempt` | BOOLEAN | Favourite review |
| `review_date` | TIMESTAMP | Review date |
| `created_at` | TIMESTAMP | Creation time |

### Relationship

```text
UserProblemActivity 1 ───── N ProblemReview
```

Reviews provide historical learning information used by the learning engine.

---

# 15. Refresh Tokens

### Table

```text
refresh_tokens
```

### Fields

| Field | Type | Description |
|---|---|---|
| `id` | BIGINT | Primary key |
| `token` | VARCHAR | Unique refresh token |
| `expiry_date` | TIMESTAMP | Expiration time |
| `user_id` | BIGINT | Associated user |

### Relationship

The current entity maps a refresh token to a user.

Refresh tokens are used to issue new access tokens.

---

# 16. Password Reset Tokens

### Table

```text
password_reset_tokens
```

### Fields

| Field | Type | Description |
|---|---|---|
| `id` | BIGINT | Primary key |
| `token` | VARCHAR | Unique reset token |
| `expiry_date` | TIMESTAMP | Expiration time |
| `user_id` | BIGINT | Associated user |

### Relationship

Each reset token is associated with a user.

Reset tokens are removed after a successful password reset.

---

# 17. Main Relationships

```text
User
 │
 ├─────────────── N UserProblemActivity
 │                         │
 │                         ├──────── N ProblemReview
 │                         │
 │                         ├──────── 1 Problem
 │                         │
 │                         └──────── 0..1 Roadmap
 │
 ├─────────────── RefreshToken
 │
 └─────────────── PasswordResetToken


Topic
 │
 └────────────── N Problem


Problem
 │
 ├────────────── N UserProblemActivity
 ├────────────── N RoadmapProblem
 ├────────────── M:N Company
 └────────────── M:N Tag


Roadmap
 │
 └────────────── N RoadmapProblem
```

---

# 18. Derived Learning Data

Solvr distinguishes raw activity from calculated learning data.

## Raw signals

Examples:

- Status
- Attempts
- Time spent
- Confidence
- Revision count
- Review history

## Derived values

Examples:

- Understanding score
- Retention score
- Confidence score
- Consistency score
- Final mastery score
- Revision classification

The learning engine calculates these values from activity/review data.

The latest mastery result is stored in:

```text
user_problem_activities.mastery_score
```

This avoids duplicating every intermediate calculation in the database.

---

# 19. Mastery Data Flow

```text
UserProblemActivity
        │
        ├── status
        ├── attempts
        ├── time
        ├── confidence
        └── revision
                │
                ▼
          Normalization
                │
                ▼
          Dimension Scores
                │
                ▼
           Aggregation
                │
                ▼
            Rules
                │
                ▼
         mastery_score
```

---

# 20. Revision Data

Revision state is stored on `user_problem_activities`:

```text
need_revision
revision_count
next_revision_date
```

The revision engine uses these fields to classify records into:

```text
Overdue
Today
Upcoming
```

The current scheduler uses:

```text
1 day
3 days
7 days
14 days
30 days
```

as revision intervals.

---

# 21. Database Design Principles

### Normalize core facts

User, problem, topic, company, tag, and roadmap information is stored separately.

### Avoid duplicate problem metadata

Companies and tags use many-to-many relationships rather than duplicating their names in every problem row.

### Keep activity user-specific

A user's problem state is stored in `user_problem_activities`.

### Preserve review history

Reviews are stored separately from the current activity state.

### Use explicit association entities where attributes exist

`roadmap_problems` contains `display_order`, so it is represented as an entity rather than an anonymous join table.

---

# 22. Current Schema Management

The backend currently uses:

```properties
spring.jpa.hibernate.ddl-auto=update
```

Hibernate updates the schema based on entity definitions.

For a mature production environment, schema migrations should eventually be managed with a dedicated migration tool such as Flyway or Liquibase.
