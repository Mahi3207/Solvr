# Solvr — Software Requirements Specification

## 1. Introduction

### 1.1 Purpose

This document defines the functional and non-functional requirements
for the Solvr DSA learning platform.

### 1.2 Scope

Solvr allows users to:

- manage DSA problem-solving activity
- track progress
- review problems
- monitor topic-wise performance
- manage revisions
- follow roadmaps

Administrators can manage the platform's problems, topics, companies,
tags, and roadmaps.

---

## 2. User Roles

### 2.1 User

A user can:

- register and log in
- browse problems
- search problems
- record problem activity
- review problems
- bookmark/favourite problems
- view dashboard analytics
- view revisions
- follow roadmaps
- manage their account

### 2.2 Admin

An admin can:

- manage users
- manage problems
- manage topics
- manage companies
- manage tags
- manage roadmaps
- manage roadmap problems

---

## 3. Functional Requirements

### FR-01 Authentication

The system shall allow users to register and authenticate securely.

### FR-02 Authorization

The system shall restrict administrator operations to users with
the ADMIN role.

### FR-03 Problem Management

The system shall allow administrators to create, update, view,
and delete DSA problems.

### FR-04 Problem Activity

The system shall allow users to record their progress on problems.

### FR-05 Problem Review

The system shall allow users to create and manage problem reviews.

### FR-06 Dashboard

The system shall display user-specific progress and learning metrics.

### FR-07 Topic Analytics

The system shall provide topic-wise performance information.

### FR-08 Revision

The system shall schedule and categorize problem revisions.

### FR-09 Roadmaps

The system shall allow administrators to create roadmaps and assign
problems to them.

### FR-10 Search

The system shall provide search functionality for supported resources.

### FR-11 Password Recovery

The system shall provide password reset functionality through email.

---

## 4. Non-Functional Requirements

### NFR-01 Security

Passwords shall be securely hashed and protected resources shall
require authentication.

### NFR-02 Performance

API operations should return within an acceptable response time
under normal application usage.

### NFR-03 Maintainability

The application shall separate controllers, services, repositories,
and specialized business logic.

### NFR-04 Scalability

The system should support multiple independent users and their
individual learning activity.

### NFR-05 Usability

The frontend shall provide clear navigation and feedback for
loading, errors, and empty states.

---

## 5. Constraints

- Backend: Spring Boot
- Frontend: React + Vite
- Database: PostgreSQL
- Authentication: JWT
- ORM: Spring Data JPA / Hibernate

---

## 6. Current Scope

The current release includes authentication, problem management,
activity tracking, reviews, analytics, revision scheduling,
roadmaps, and administration.
