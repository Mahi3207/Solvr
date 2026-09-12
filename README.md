# Solvr 🚀

Solvr is a full-stack DSA learning platform designed to help students track their problem-solving progress, analyze topic-wise performance, manage revisions, and follow structured DSA roadmaps.

## 🛠️ Features

- **User Authentication**: Secure registration, login, JWT authentication, password reset, and account management.
- **Problem Tracking**: Browse, search, filter, and track DSA problems and solving activity.
- **Topic-wise Analytics**: Monitor progress and mastery across different DSA topics.
- **Problem Reviews**: Record confidence, understanding, and mistakes after solving problems.
- **Revision System**: Track today's, overdue, and upcoming problems for revision.
- **Roadmaps**: Follow structured DSA learning paths containing ordered problems.
- **Admin Dashboard**: Manage users, problems, topics, companies, tags, and roadmaps.
- **Role-based Access**: Separate user and admin functionality with protected routes.
- **Responsive UI**: React-based interface for a smooth learning experience.

## 🚀 Getting Started

Follow these instructions to get a local copy of Solvr running.

### Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- npm
- PostgreSQL
- Git
- Maven

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Mahi3207/Solvr.git
```

2. Navigate to the project directory:

```bash
cd solvr
```

3. Configure the backend environment variables.

Create a `.env` file in the `backend` directory using `.env.example`:

```env
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_email_app_password
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

4. Create the PostgreSQL database:

```sql
CREATE DATABASE dsa_compass;
```

5. Start the backend.

**Windows:**

```bash
cd backend
mvnw.cmd spring-boot:run
```

**macOS/Linux:**

```bash
cd backend
./mvnw spring-boot:run
```

6. Start the frontend in a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

## 💻 Usage

After starting the application:

1. Register a user account.
2. Log in to access the dashboard.
3. Browse and search DSA problems.
4. Track your problem-solving activity.
5. Add reviews and monitor your performance.
6. Use analytics to identify topic-wise progress.
7. Follow roadmaps for structured preparation.
8. Use the revision section to revisit problems.

### Admin

Admin accounts are created through the database rather than public registration. An administrator can manage users and DSA content through the admin dashboard.

## 🧰 Tech Stack

**Frontend**
- React
- Vite
- JavaScript
- React Router
- Axios
- Context API
- CSS

**Backend**
- Java
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- Hibernate
- Maven

**Database**
- PostgreSQL

## 🤝 Contributing

Contributions are welcome.

1. Fork the project.
2. Create your feature branch:

```bash
git checkout -b feature/AmazingFeature
```

3. Commit your changes:

```bash
git commit -m "Add some AmazingFeature"
```

4. Push to the branch:

```bash
git push origin feature/AmazingFeature
```

5. Open a Pull Request.

## Documentation

Detailed project documentation:

- [Requirements](docs/requirements.md)
- [Architecture](docs/architecture.md)
- [Database Design](docs/database-design.md)
- [API Design](docs/api-design.md)

## 📝 License

This project is currently intended as a personal/educational portfolio project.

## 📫 Contact

**Mahek Maurya**

Project Link: [GitHub Repository](https://github.com/Mahi3207/Solvr)
