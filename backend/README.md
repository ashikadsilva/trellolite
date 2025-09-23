# TrelloLite

A simple full-stack project with **Spring Boot backend** and **React frontend**, secured using **Keycloak authentication**.

---

## Project Structure
trellolite/
│
├─ backend/ # Spring Boot REST API (Keycloak-secured)
├─ frontend/ # React app (Keycloak login + API calls)
└─ README.md # Project overview


---

## How It Works

- **Backend** exposes REST APIs and validates from Keycloak.
- **Frontend** uses Keycloak adapter for login/logout and calls backend APIs.
- **Keycloak** manages authentication and issues tokens.

---

## Setup Flow

1. Start **Keycloak** and configure realm, client(s), and users.
2. Start **Backend** (`mvn spring-boot:run`).
3. Start **Frontend** (`npm start`).
4. Login through Keycloak → access protected endpoints.

---

# TrelloLite Backend

Spring Boot backend with **Keycloak authentication** and **MySQL persistence**.  
Provides REST APIs for user management and protected resources.

---

## Tech Stack

- Java 17+
- Spring Boot 3.x
- Spring Security (OAuth2 Resource Server, JWT)
- Spring Data JPA + MySQL
- Maven
- Lombok

---

## Implemented Features

- User entity + JPA repository
- JWT authentication with Keycloak
- CORS configured for frontend (http://localhost:3000)

---

### 1. Configure Environment

Create `.env` or use application.properties:

```env
DB_USERNAME=<db-user>
DB_PASSWORD=<db-pass>
KEYCLOAK_ISSUER_URI=<YOUR_KEYCLOAK_ISSUER_URI>
KEYCLOAK_JWK_URI=<YOUR_KEYCLOAK_JWK_URI>
```