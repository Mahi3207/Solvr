# Solvr 🚀

Solvr is a full-stack DSA learning platform designed to help students track their problem-solving progress, analyze topic-wise performance, manage revisions, and follow structured DSA roadmaps.

🔗 **Live Demo:** [https://solvr-delta.vercel.app](https://solvr-delta.vercel.app)

> Note: The backend is hosted on Render's free tier, so the first request after a period of inactivity may take up to ~50 seconds to respond while the server spins back up.

## 🛠️ Features

* User Authentication: Secure registration, login, JWT authentication, password reset, and account management.

* Problem Tracking: Browse, search, filter, and track DSA problems and solving activity.

* Topic-wise Analytics: Monitor progress and mastery across different DSA topics.

* Problem Reviews: Record confidence, understanding, and mistakes after solving problems.

* Revision System: Track today's, overdue, and upcoming problems for revision.

* Roadmaps: Follow structured DSA learning paths containing ordered problems.

* Admin Dashboard: Manage users, problems, topics, companies, tags, and roadmaps.

* Role-based Access: Separate user and admin functionality with protected routes.

* Responsive UI: React-based interface for a smooth learning experience.

## 🌐 Deployment

Solvr is deployed using the following services:

| Layer | Service | Notes |

|---|---|---|

| Frontend | [Vercel](https://vercel.com) | Vite + React, deployed from `backend/solvr-frontend/frontend` |

| Backend | [Render](https://render.com) | Spring Boot, deployed via Dockerfile |

| Database | [Neon](https://neon.tech) | Managed PostgreSQL |

| Transactional Email | [Brevo](https://www.brevo.com) | Sends password reset emails via HTTP API |

**Why Brevo instead of direct SMTP?** Render (like most cloud hosts) blocks outbound SMTP ports (25/465/587) on its network to prevent spam abuse. Brevo's HTTP API sends emails over standard HTTPS, which isn't blocked, making it compatible with Render's free tier.

## 🚀 Getting Started

Follow these instructions to get a local copy of Solvr running.

### Prerequisites

* Java 17 or higher

* Node.js 18 or higher

* npm

* PostgreSQL

* Git

* Maven

### Installation

1\. Clone the repository:

```

git clone https://github.com/Mahi3207/Solvr.git

```

2\. Navigate to the project directory:

```

cd solvr

```

3\. Configure the backend environment variables.

Create a `.env` file in the `backend` directory using `.env.example`:

```

DB_URL=jdbc:postgresql://localhost:5432/dsa_compass

DB_USERNAME=your_database_username

DB_PASSWORD=your_database_password

BREVO_API_KEY=your_brevo_api_key

BREVO_SENDER_EMAIL=your_verified_sender_email

JWT_SECRET=your_jwt_secret

FRONTEND_URL=http://localhost:5173

```

> Note: Password reset emails require a [Brevo](https://www.brevo.com) account with a verified sender email. Brevo's free tier includes 300 emails/day and does not require owning a custom domain — a single verified email address is sufficient.

4\. Create the PostgreSQL database:

```

CREATE DATABASE dsa_compass;

```

5\. Start the backend.

Windows:

```

cd backend

mvnw.cmd spring-boot:run

```

macOS/Linux:

```

cd backend

./mvnw spring-boot:run

```

6\. Start the frontend in a new terminal:

```

cd frontend

npm install

npm run dev

```

The application will be available at:

```

http://localhost:5173

```

## 💻 Usage

After starting the application:

1\. Register a user account.

2\. Log in to access the dashboard.

3\. Browse and search DSA problems.

4\. Track your problem-solving activity.

5\. Add reviews and monitor your performance.

6\. Use analytics to identify topic-wise progress.

7\. Follow roadmaps for structured preparation.

8\. Use the revision section to revisit problems.

### Admin

Admin accounts are created through the database rather than public registration. To promote a user to admin, update their role directly via SQL:

```sql

UPDATE users SET role = 'ADMIN' WHERE email = 'user@example.com';

```

> Note: Since role information is embedded in the JWT issued at login, the affected user must log out and log back in for the updated role to take effect.

An administrator can manage users and DSA content through the admin dashboard.

## 🧰 Tech Stack

### Frontend

* React

* Vite

* JavaScript

* React Router

* Axios

* Context API

* CSS

### Backend

* Java

* Spring Boot

* Spring Security

* JWT

* Spring Data JPA

* Hibernate

* Maven

### Database

* PostgreSQL ([Neon](https://neon.tech) in production)

### Infrastructure \& Services

* [Render](https://render.com) — Backend hosting (Docker)

* [Vercel](https://vercel.com) — Frontend hosting

* [Brevo](https://www.brevo.com) — Transactional email (password reset)

## 🤝 Contributing

Contributions are welcome.

1\. Fork the project.

2\. Create your feature branch:

```

git checkout -b feature/AmazingFeature

```

3\. Commit your changes:

```

git commit -m "Add some AmazingFeature"

```

4\. Push to the branch:

```

git push origin feature/AmazingFeature

```

5\. Open a Pull Request.

## Documentation

Detailed project documentation:

* [Requirements](https://github.com/Mahi3207/Solvr/blob/main/docs/Requirements.md)

* [Architecture](https://github.com/Mahi3207/Solvr/blob/main/docs/architecture.md)

* [Database Design](https://github.com/Mahi3207/Solvr/blob/main/docs/database-design.md)

* [API Design](https://github.com/Mahi3207/Solvr/blob/main/docs/api-design.md)

## 📝 License

This project is currently intended as a personal/educational portfolio project.

## 📫 Contact

Mahek Maurya

Project Link: [GitHub Repository](https://github.com/Mahi3207/Solvr)
