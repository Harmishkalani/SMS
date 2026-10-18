# Student Management System — Project Report

**Project title:** Student Management System (CampusDesk)  
**Document status:** Generated project documentation; verify implementation and tests in the target environment before submission.

## 1. Abstract
CampusDesk is a web-based student management application intended to help an administrator maintain student identity, course, academic year, and status records. A React single-page frontend communicates with an Express REST API. MongoDB stores users and student records through Mongoose. Authentication uses bcrypt password hashing and signed JSON Web Tokens. The project includes CRUD screens, dashboard statistics, search, status filtering, pagination, API documentation, tests, and UML source diagrams.

## 2. Introduction
Manual student registers and disconnected spreadsheets can make it difficult to search, update, and consistently maintain student records. A centralized web application provides a structured interface and persistent database for common student administration tasks.

## 3. Problem Statement
A small institution or classroom project needs a straightforward way to create, view, update, search, and delete student records while preventing unauthenticated access and preserving data in a database.

## 4. Objectives
- Provide secure account registration and login.
- Maintain student profiles with validated fields.
- Provide a responsive dashboard and student directory.
- Persist all records in MongoDB.
- Expose documented REST endpoints.
- Demonstrate system design through UML and ER diagrams.
- Provide repeatable setup and test instructions for Windows.

## 5. Scope and Assumptions
The application is designed for a single administrator account model. Each user sees only student records created under that user's account. Roles are represented in the user schema as `admin`; institution-wide multi-role workflows, student self-service, attendance, fee management, and report exports are outside the initial scope. Sample seed records are optional and clearly identified as sample data.

## 6. Existing and Proposed Systems
**Existing approach:** paper registers or separate spreadsheets may require manual searching and repeated data entry.  
**Proposed approach:** a responsive dashboard with validated forms, server-side access control, indexed MongoDB records, and documented APIs.

## 7. Requirements
### Functional
1. Register and authenticate an administrator.
2. Protect dashboard and student APIs.
3. Create, list, read, update, and delete student records.
4. Search by roll number, name, email, or course.
5. Filter by student status and paginate results.
6. Show totals by status on the dashboard.
7. Provide a health endpoint and Swagger UI.

### Non-functional
- Responsive layout for desktop, tablet, and mobile.
- Server-side validation and meaningful HTTP status codes.
- Password hashes rather than plaintext passwords.
- Environment-based secrets and database configuration.
- Separation of UI, API routes, controllers, models, and middleware.
- Clear failure behavior when MongoDB is unavailable.

## 8. Software and Hardware Requirements
**Software:** Windows 10/11, Node.js 20+, npm, MongoDB Community Server or MongoDB Atlas, MongoDB Compass, and optionally Visual Studio Code.  
**Hardware:** a modern personal computer with sufficient memory to run a browser, Node.js, and a local database. No specific benchmark has been measured.

## 9. Technology Stack and Justification
- **React + Vite:** component-based, fast frontend development.
- **React Router DOM:** client-side page navigation and protected routes.
- **Axios:** HTTP requests to the REST API.
- **Node.js + Express:** JavaScript runtime and API framework.
- **MongoDB + Mongoose:** document storage, schema validation, indexes, and model operations.
- **bcryptjs:** password hashing.
- **JWT:** stateless API authentication.
- **Helmet, CORS, rate limiting:** baseline HTTP headers, cross-origin configuration, and request throttling.
- **Swagger UI/OpenAPI:** interactive API reference.

## 10. Architecture
The browser renders the React UI. Axios sends requests to the Express API. Authentication middleware verifies bearer tokens; controllers validate and process requests; Mongoose queries MongoDB. JSON responses are displayed by the UI. See `uml/system-architecture.mmd`, `uml/component.puml`, and `uml/deployment.puml`.

## 11. UML Diagrams
The `docs/uml/` directory contains source for use case, class/domain model, authentication and CRUD sequence, activity, component, deployment, ERD, and system architecture diagrams. Diagram definitions describe the intended implemented structure and should be updated if the code changes. Mermaid sources can be rendered by Mermaid-compatible tools; PlantUML sources can be rendered by PlantUML.

## 12. Database Design
The system uses two collections:
- `users`: name, normalized unique email, password hash, role, timestamps.
- `students`: roll number, first and last name, email, course, academic year, status, creator reference, timestamps.

Each student belongs to the user who created it. A compound unique index prevents duplicate roll numbers for the same user. See `DATABASE.md`.

## 13. API Design
Authentication routes are `/api/auth/register` and `/api/auth/login`. Protected student routes are under `/api/students`, with `/dashboard` for aggregate statistics. A health check is available at `/api/health`; Swagger UI is at `/api-docs`. See `openapi.yaml` for request/response contracts.

## 14. Frontend Modules
- **Login/Register:** account forms, validation, session-storage token handling.
- **Dashboard:** database-derived totals and recent students.
- **Students:** list, search, status filter, pagination, create/edit modal, and delete confirmation.
- **Layout:** navigation, account identity, and sign-out.
- **API service:** shared Axios instance with bearer token.

## 15. Backend Modules
- **Models:** Mongoose user and student schemas.
- **Controllers:** authentication, student CRUD, and dashboard counts.
- **Routes:** REST endpoint mapping.
- **Middleware:** token verification, 404 response, and centralized errors.
- **Configuration:** database connection and environment setup.
- **Seed script:** optional sample student data for a registered user.

## 16. Security Considerations
Passwords are hashed with bcryptjs. JWT signing secrets and the database URI are read from environment variables. Student queries are scoped to the authenticated user's ID to prevent cross-account access. Express uses Helmet, JSON body-size limits, CORS allow-list configuration, and rate limiting. Production deployments should use HTTPS, rotate secrets, consider refresh-token/session strategy, add stronger audit logging, review dependency vulnerabilities, and configure database network access and backups. JWTs are stored in session storage in this demo; a production security review should consider an HttpOnly, Secure, SameSite cookie design and its CSRF implications.

## 17. Testing Strategy and Results
Automated unit tests are included for email and student validation. Run `npm test --prefix backend` after installing backend dependencies. Database integration and browser end-to-end tests are not claimed as executed by this generated package. See `TESTING.md` for the test matrix and manual verification steps. Record actual results after running the project locally; do not report planned checks as passed.

## 18. Installation and Execution
Follow the Windows instructions in `README.md`. Configure `backend/.env`, start MongoDB, run `npm install` and `npm run install:all`, then `npm run dev`. The UI defaults to port 5173 and API to port 5000.

## 19. Limitations
- No student self-service login or multiple fine-grained roles.
- No file uploads, attendance, fees, CSV export, or password reset flow.
- Dashboard metrics are refreshed on page load rather than pushed live.
- Automated database integration and end-to-end tests need to be added/run in an environment with MongoDB and browser tooling.
- No genuine application screenshots are bundled because the app has not been launched against a live database in this packaging environment.

## 20. Future Enhancements
Add role-based staff permissions, student portal, attendance, grades, fee management, exports, audit logs, password reset, refresh-token rotation, integration/E2E tests, CI pipeline, and deployment configuration.

## 21. Conclusion
CampusDesk provides a structured starting point for a full-stack student management application. It separates the React interface from the Express API and MongoDB persistence, includes core CRUD and authentication code, and supplies documentation to support setup, review, and future enhancement. Runtime behavior must be verified on the target Windows machine before final academic submission.

## 22. References
- React documentation: https://react.dev/
- Vite documentation: https://vite.dev/
- Express documentation: https://expressjs.com/
- MongoDB documentation: https://www.mongodb.com/docs/
- Mongoose documentation: https://mongoosejs.com/docs/
- OpenAPI specification: https://spec.openapis.org/oas/latest.html
- Mermaid documentation: https://mermaid.js.org/
- PlantUML documentation: https://plantuml.com/
