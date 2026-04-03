# Finance Data Processing and Access Control System

## Project Overview
This is a secure, well-structured backend application built with **Spring Boot** and **Java 17**.
It manages users, role-based access to financial records, and aggregate dashboard analytics.

## Setup Instructions

1. Ensure **Java 17** and **Maven** are installed.
2. Navigate to the project directory:
   ```bash
   cd finance-backend
   ```
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
4. The application will start on `http://localhost:8080`.

## Assumptions Made
- Default admin is created on startup: `admin@finance.com` / `admin123`.
- Simple token-based API authentication handles access control.
- An in-memory H2 database is used.

## API Endpoints Documentation
Refer to the Swagger UI once the application is running:
`http://localhost:8080/swagger-ui.html`

