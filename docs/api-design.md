# Solvr — API Design

## 1. Overview

Solvr exposes a REST API from the Spring Boot backend.

### Base URL

Local development:

```text
http://localhost:8080/api
```

Production:

```text
https://solvr-hs99.onrender.com/api
`
The frontend communicates with the backend through Axios services.

---

# 2. Standard Response Format

Most endpoints use:

```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

Example:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "Mahi",
    "email": "mahi@example.com",
    "role": "USER"
  }
}
```

Error responses use the application's structured error response.

---

# 3. Authentication

Authentication endpoints are under:

```text
/api/auth
```

## Register

```http
POST /api/auth/register
```

Creates a normal user account.

Request:

```json
{
  "name": "Mahi",
  "email": "mahi@example.com",
  "password": "password123"
}
```

Registration creates:

```text
role = USER
```

There is no public admin-registration endpoint.

---

## Login

```http
POST /api/auth/login
```

Request:

```json
{
  "email": "mahi@example.com",
  "password": "password123"
}
```

Returns login information including an access token and refresh-token information used by the frontend authentication flow.

---

## Refresh Access Token

```http
POST /api/auth/refresh?refreshToken=<refresh-token>
```

Validates the refresh token and generates a new access token.

---

## Logout

```http
POST /api/auth/logout?email=<user-email>
```

Invalidates the stored refresh token associated with the user.

---

## Forgot Password

```http
POST /api/auth/forgot-password
```

Request:

```json
{
  "email": "mahi@example.com"
}
```

Creates a password-reset token and sends an email containing a reset link.

The reset link expires after 15 minutes.

> Email delivery is handled via Brevo's transactional email API (see architecture.md, Section 21). Sending fails if `BREVO_API_KEY` or `BREVO_SENDER_EMAIL` are not configured.


---

## Reset Password

```http
POST /api/auth/reset-password
```

Request:

```json
{
  "token": "<reset-token>",
  "newPassword": "newPassword123"
}
```

Validates the reset token, changes the password, and removes the reset token.

---

## Current User

```http
GET /api/auth/me
```

Returns the authenticated user's profile.

---

# 4. User APIs

Base path:

```text
/api/users
```

## Get My Profile

```http
GET /api/users/me
```

Returns the authenticated user's profile.

---

## Update My Profile

```http
PUT /api/users/me
```

Request:

```json
{
  "name": "Updated Name"
}
```

---

## Change Password

```http
PUT /api/users/change-password
```

Request:

```json
{
  "currentPassword": "oldPassword",
  "newPassword": "newPassword123"
}
```

---

## Delete My Account

```http
DELETE /api/users/me
```

Deletes the authenticated user's account.

---

## Admin: Get User by ID

```http
GET /api/users/{id}
```

Admin access.

---

## Admin: Delete User

```http
DELETE /api/users/{id}
```

Admin access.

---

# 5. Problem APIs

Base path:

```text
/api/problems
```

## Get Problems

```http
GET /api/problems
```

Authenticated users can retrieve problems.

---

## Get Problem

```http
GET /api/problems/{id}
```

Returns a single problem.

---

## Create Problem

```http
POST /api/problems
```

Admin only.

Request fields:

```json
{
  "title": "Two Sum",
  "description": "Problem description",
  "difficulty": "EASY",
  "platform": "LEETCODE",
  "problemUrl": "https://example.com/problem",
  "estimatedTime": 20,
  "topicId": 1,
  "companyIds": [1, 2],
  "tagIds": [1, 3],
  "premium": false
}
```

---

## Update Problem

```http
PUT /api/problems/{id}
```

Admin only.

---

## Delete Problem

```http
DELETE /api/problems/{id}
```

Admin only.

---

# 6. Topic APIs

Base path:

```text
/api/topics
```

## Get Topics

```http
GET /api/topics
```

Retrieves topics.

---

## Get Topic

```http
GET /api/topics/{id}
```

---

## Create Topic

```http
POST /api/topics
```

Admin only.

Request:

```json
{
  "name": "Graphs",
  "description": "Graph algorithms and traversal",
  "displayOrder": 8
}
```

---

## Update Topic

```http
PUT /api/topics/{id}
```

Admin only.

---

## Delete Topic

```http
DELETE /api/topics/{id}
```

Admin only.

---

# 7. Company APIs

Base path:

```text
/api/companies
```

## Get Companies

```http
GET /api/companies
```

Authenticated access.

---

## Get Company

```http
GET /api/companies/{id}
```

Authenticated access.

---

## Create Company

```http
POST /api/companies
```

Admin only.

Request:

```json
{
  "name": "Google"
}
```

---

## Update Company

```http
PUT /api/companies/{id}
```

Admin only.

---

## Delete Company

```http
DELETE /api/companies/{id}
```

Admin only.

---

# 8. Tag APIs

Base path:

```text
/api/tags
```

## Get Tags

```http
GET /api/tags
```

Authenticated access.

---

## Get Tag

```http
GET /api/tags/{id}
```

Authenticated access.

---

## Create Tag

```http
POST /api/tags
```

Admin only.

Request:

```json
{
  "name": "Two Pointer"
}
```

---

## Update Tag

```http
PUT /api/tags/{id}
```

Admin only.

---

## Delete Tag

```http
DELETE /api/tags/{id}
```

Admin only.

---

# 9. Roadmap APIs

Base path:

```text
/api/roadmaps
```

## Get Roadmaps

```http
GET /api/roadmaps
```

Available to authenticated users.

---

## Get Roadmap

```http
GET /api/roadmaps/{id}
```

---

## Create Roadmap

```http
POST /api/roadmaps
```

Admin only.

Request:

```json
{
  "title": "DSA Beginner Roadmap",
  "description": "A structured beginner roadmap",
  "level": "BEGINNER",
  "estimatedDuration": 60
}
```

---

## Update Roadmap

```http
PUT /api/roadmaps/{id}
```

Admin only.

---

## Delete Roadmap

```http
DELETE /api/roadmaps/{id}
```

Admin only.

---

# 10. Roadmap Problem APIs

Base path:

```text
/api
```

## Add Problem to Roadmap

```http
POST /api/roadmaps/{roadmapId}/problems
```

Admin only.

Request:

```json
{
  "problemId": 25,
  "displayOrder": 1
}
```

---

## Get Roadmap Problems

```http
GET /api/roadmaps/{roadmapId}/problems
```

Authenticated access.

---

## Get Roadmap Problem

```http
GET /api/roadmap-problems/{id}
```

---

## Update Roadmap Problem

```http
PUT /api/roadmap-problems/{id}
```

Admin only.

Request:

```json
{
  "displayOrder": 2
}
```

---

## Remove Problem from Roadmap

```http
DELETE /api/roadmap-problems/{id}
```

Admin only.

---

# 11. Activity APIs

Base path:

```text
/api/activity
```

Activity APIs are user-specific.

## Create Activity

```http
POST /api/activity
```

Request:

```json
{
  "problemId": 25,
  "roadmapId": 3,
  "status": "SOLVED",
  "attemptCount": 2,
  "timeSpent": 30,
  "confidenceLevel": 4,
  "difficultyRating": 3,
  "notes": "Used HashMap approach",
  "bookmarked": false,
  "favourite": true,
  "needRevision": true
}
```

---

## Get My Activities

```http
GET /api/activity
```

Returns the authenticated user's activities.

---

## Get Activity

```http
GET /api/activity/{id}
```

Returns one owned activity.

---

## Update Activity

```http
PUT /api/activity/{id}
```

Updates an owned activity.

---

## Delete Activity

```http
DELETE /api/activity/{id}
```

Deletes an owned activity.

---

## Get Activities by Status

```http
GET /api/activity/status/{status}
```

Supported statuses:

```text
NOT_STARTED
IN_PROGRESS
SOLVED
MASTERED
```

---

## Get Bookmarks

```http
GET /api/activity/bookmarks
```

---

## Get Favourites

```http
GET /api/activity/favourites
```

---

## Get Revision Activities

```http
GET /api/activity/revision
```

Returns activities marked for revision.

---

# 12. Problem Review APIs

Base path:

```text
/api/reviews
```

## Create Review

```http
POST /api/reviews
```

Request:

```json
{
  "problemId": 25,
  "status": "SOLVED",
  "attemptCount": 2,
  "timeSpent": 30,
  "confidenceLevel": 4,
  "difficultyRating": 3,
  "needRevision": true,
  "mistakeType": "EDGE_CASE",
  "notes": "Missed empty input case",
  "favoriteAttempt": false
}
```

---

## Get Review

```http
GET /api/reviews/{id}
```

---

## Get Reviews for Problem

```http
GET /api/reviews/problem/{problemId}
```

---

## Delete Review

```http
DELETE /api/reviews/{id}
```

---

# 13. Dashboard APIs

Base path:

```text
/api/dashboard
```

## Dashboard Summary

```http
GET /api/dashboard
```

Provides summary data such as:

- Total problems
- Solved problems
- Attempted problems
- Average mastery
- Revision due

---

## Topic Analytics

```http
GET /api/dashboard/topics
```

Returns topic-wise analytics for the authenticated user.

---

# 14. Revision APIs

Base path:

```text
/api/revision
```

## Today's Revisions

```http
GET /api/revision/today
```

Returns revisions scheduled from the current time through the end of today.

---

## Overdue Revisions

```http
GET /api/revision/overdue
```

Returns revisions whose next revision date is before the current time.

---

## Upcoming Revisions

```http
GET /api/revision/upcoming
```

Returns revisions scheduled after today.

---

# 15. Search APIs

Base path:

```text
/api/search
```

## Search Problems

```http
GET /api/search/problems
```

---

## Search Topics

```http
GET /api/search/topics
```

---

## Search Companies

```http
GET /api/search/companies
```

---

## Search Tags

```http
GET /api/search/tags
```

---

## Search Roadmaps

```http
GET /api/search/roadmaps
```

Search endpoints are used by the frontend for faster content discovery.

---

# 16. Learning Engine API

Base path:

```text
/api/learning-engine
```

## Calculate Mastery

```http
POST /api/learning-engine/activities/{activityId}/calculate
```

The activity must belong to the authenticated user.

The service:

1. Loads the activity.
2. Verifies ownership.
3. Loads the activity's reviews.
4. Normalizes raw signals.
5. Calculates learning dimensions.
6. Aggregates the dimensions.
7. Applies mastery rules.
8. Persists the final score.
9. Returns the calculation breakdown.

Example response data:

```json
{
  "activityId": 12,
  "problemId": 25,
  "understandingScore": 78.5,
  "retentionScore": 65.0,
  "confidenceScore": 82.0,
  "consistencyScore": 60.0,
  "finalMasteryScore": 72.9,
  "calculatedAt": "2026-09-12T20:00:00"
}
```

---

# 17. Admin APIs

Base path:

```text
/api/admin
```

## Get All Users

```http
GET /api/admin/users
```

Admin only.

---

## Delete User

```http
DELETE /api/admin/users/{id}
```

Admin only.

---

# 18. Authorization Summary

| Area | USER | ADMIN |
|---|:---:|:---:|
| Register/Login | ✅ | ✅ |
| View problems | ✅ | ✅ |
| Manage problems | ❌ | ✅ |
| View topics | ✅ | ✅ |
| Manage topics | ❌ | ✅ |
| View companies | ✅ | ✅ |
| Manage companies | ❌ | ✅ |
| View tags | ✅ | ✅ |
| Manage tags | ❌ | ✅ |
| View roadmaps | ✅ | ✅ |
| Manage roadmaps | ❌ | ✅ |
| Manage roadmap problems | ❌ | ✅ |
| Manage own activity | ✅ | ❌* |
| Manage own reviews | ✅ | ❌* |
| Dashboard | ✅ | Not used as user dashboard |
| Learning calculation | Own activities | Protected through authenticated API |
| User administration | ❌ | ✅ |

`*` The normal user activity/review endpoints are designed around the authenticated user.

---

# 19. Authentication Header

Protected requests use:

```http
Authorization: Bearer <access-token>
```

Example:

```http
GET /api/dashboard
Authorization: Bearer eyJ...
```

---

# 20. API Design Principles

### Consistent responses

Responses use:

```text
success
message
data
```

### DTO-based contracts

Request and response DTOs prevent database entities from becoming direct API contracts.

### Thin controllers

Controllers delegate business logic to services.

### Role-based authorization

Admin operations are protected at the backend.

### User ownership checks

User-specific operations use the authenticated user's identity rather than trusting a user ID supplied by the client.

### REST-style resources

Resources are organized around:

```text
auth
users
problems
topics
companies
tags
roadmaps
activity
reviews
revision
dashboard
search
learning-engine
admin
```
