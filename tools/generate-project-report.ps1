$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$output = Join-Path $root 'docs\CampusDesk_Project_Report.docx'
$wdPageBreak = 7
$wdCollapseEnd = 0
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
$doc = $word.Documents.Add()
$sel = $word.Selection

$normal = $doc.Styles.Item('Normal')
$normal.Font.Name = 'Calibri'; $normal.Font.Size = 11
$normal.ParagraphFormat.SpaceAfter = 8
$normal.ParagraphFormat.LineSpacingRule = 0
$doc.Styles.Item('Heading 1').Font.Name = 'Aptos Display'
$doc.Styles.Item('Heading 1').Font.Size = 18
$doc.Styles.Item('Heading 1').Font.Color = 10040115
$doc.Styles.Item('Heading 2').Font.Name = 'Aptos Display'
$doc.Styles.Item('Heading 2').Font.Size = 14
$doc.Styles.Item('Heading 2').Font.Color = 10040115

function Text([string]$value, [string]$style = 'Normal') {
  $sel.Style = $style; $sel.Font.Name = 'Calibri'; $sel.Font.Size = 11
  $sel.TypeText($value); $sel.TypeParagraph()
}
function Title([string]$value) { $sel.Style = 'Title'; $sel.Font.Name = 'Aptos Display'; $sel.Font.Size = 28; $sel.Font.Bold = 1; $sel.Font.Color = 10040115; $sel.TypeText($value); $sel.TypeParagraph(); $sel.Font.Bold = 0 }
function H1([string]$value) { Text $value 'Heading 1' }
function H2([string]$value) { Text $value 'Heading 2' }
function Break { $sel.InsertBreak($wdPageBreak) }
function Bullet([string[]]$items) { foreach($item in $items) { $sel.Style = 'Normal'; $sel.Range.ListFormat.ApplyBulletDefault() | Out-Null; $sel.TypeText($item); $sel.TypeParagraph(); $sel.Range.ListFormat.RemoveNumbers() | Out-Null } }
function Code([string]$value) { $sel.Font.Name='Consolas'; $sel.Font.Size=8.5; $sel.Font.Color=4210752; $sel.ParagraphFormat.LeftIndent=18; $sel.TypeText($value); $sel.TypeParagraph(); $sel.Font.Name='Calibri'; $sel.Font.Size=11; $sel.ParagraphFormat.LeftIndent=0 }
function Table([string[][]]$rows) {
  $table = $doc.Tables.Add($sel.Range, $rows.Count, $rows[0].Count)
  $table.Style = 'Table Grid'; $table.Rows.Item(1).Range.Font.Bold = 1; $table.Rows.Item(1).Shading.BackgroundPatternColor = 15132390
  for($r=1; $r -le $rows.Count; $r++) { for($c=1; $c -le $rows[$r-1].Count; $c++) { $table.Cell($r,$c).Range.Text = $rows[$r-1][$c] } }
  $sel.SetRange($table.Range.End, $table.Range.End); $sel.TypeParagraph()
}
function Diagram([string]$caption, [string[]]$nodes) {
  $t = $doc.Tables.Add($sel.Range, $nodes.Count, 1); $t.Style='Table Grid'
  for($i=1; $i -le $nodes.Count; $i++) { $cell=$t.Cell($i,1); $cell.Range.Text=$nodes[$i-1]; $cell.Range.ParagraphFormat.Alignment=1; $cell.Range.Font.Bold=1; $cell.Shading.BackgroundPatternColor = 15132390 }
  $sel.SetRange($t.Range.End,$t.Range.End); Text $caption; $sel.TypeParagraph()
}
function Page([string]$heading, [string[]]$paragraphs) { H1 $heading; foreach($p in $paragraphs) { Text $p }; Break }

# Cover
$sel.ParagraphFormat.Alignment = 1
$sel.TypeParagraph(); $sel.TypeParagraph(); Title 'STUDENT MANAGEMENT SYSTEM'; $sel.Font.Size=16; $sel.Font.Bold=1; $sel.TypeText('CampusDesk'); $sel.TypeParagraph(); $sel.Font.Bold=0
$sel.TypeParagraph(); $sel.Font.Size=13; $sel.TypeText('A Full-Stack Web Application Project Report'); $sel.TypeParagraph(); $sel.TypeParagraph(); $sel.Font.Size=12
$sel.TypeText('Prepared by: [Your Name]'); $sel.TypeParagraph(); $sel.TypeText('Roll Number: [Your Roll Number]'); $sel.TypeParagraph(); $sel.TypeText('Submitted to: [Institution / Department Name]'); $sel.TypeParagraph(); $sel.TypeText('Academic Year: 2026–2027'); $sel.TypeParagraph(); $sel.TypeParagraph(); $sel.TypeText('October 2026'); $sel.ParagraphFormat.Alignment = 0; Break

Page 'Certificate' @(
'This is to certify that the project entitled “Student Management System (CampusDesk)” is a bona fide work prepared by the student named on the cover page. The report documents the design and implementation of a web-based application for managing student records.',
'The work demonstrates full-stack web development practices including a React user interface, an Express REST API, MongoDB persistence, authentication, validation, testing, and documentation. The implementation should be reviewed and evaluated according to the institution’s prescribed assessment process.',
'Guide signature: ____________________    Head of Department: ____________________    Date: ____________________'
)
Page 'Declaration' @(
'I declare that this report and the accompanying Student Management System project are my original work, prepared for academic evaluation. Sources and technologies used in the implementation are acknowledged in the references section.',
'I understand that environment configuration, database credentials, and deployment information are private operational details and are not included in the source repository. The report describes the implementation as available in the project workspace at the time of preparation.'
)
Page 'Acknowledgement' @(
'I express sincere gratitude to my project guide, faculty members, peers, and family for their support during the planning, implementation, testing, and documentation of this project.',
'I also acknowledge the open-source communities behind React, Vite, Express, MongoDB, Mongoose, and related libraries whose documentation made the project possible.'
)
Page 'Abstract' @(
'CampusDesk is a web-based Student Management System designed to replace scattered student registers and spreadsheets with a structured, authenticated, and searchable administration interface. The application enables an administrator to create an account, sign in, create student records, search and filter records, edit details, delete records, and view dashboard totals.',
'The solution follows a client–server architecture. A React and Vite single-page application communicates with a Node.js and Express REST API. MongoDB stores user and student documents through Mongoose. Passwords are hashed with bcrypt, JWTs protect API endpoints, and security middleware adds HTTP headers, CORS configuration, request limits, and centralized error handling.',
'The report explains requirements, architecture, database design, API contracts, security controls, implementation choices, important code, testing, setup, limitations, and future scope. The system is a focused educational implementation and can be extended for institution-wide workflows.'
)

H1 'Table of Contents'; Table @(
@('Section','Description'),@('1','Introduction and problem statement'),@('2','Requirements and feasibility'),@('3','Technology stack and architecture'),@('4','Design diagrams and database model'),@('5','Implementation and important code'),@('6','Testing, setup, security, and conclusion')
); Break

Page '1. Introduction' @(
'Educational institutions need reliable access to student identity, academic course, year, and current status information. When these details are maintained in paper registers or independent spreadsheet files, searching and updating data can be slow and inconsistent. Records may be duplicated, incorrectly edited, or exposed to users who should not have access.',
'CampusDesk addresses this problem with a browser-based administration workspace. It focuses on core student record management rather than attempting to model every academic process. The solution provides a clean starting point for a small institution, department, class coordinator, or academic project.',
'The application is intentionally separated into frontend, backend, and database layers. This makes the user interface easier to evolve independently from the REST API and makes persistence concerns explicit.'
)
Page '1.1 Problem Statement and Motivation' @(
'The central problem is the absence of a simple, secure, and maintainable system for managing a small collection of student records. A suitable solution must allow an authorized administrator to add, locate, update, and remove records without directly manipulating database data.',
'The project aims to reduce repetitive manual effort and improve consistency. Data validation ensures that required fields are provided; database indexes protect against duplicate roll numbers for the same owner; and authentication prevents anonymous access to student endpoints.',
'The scope is deliberately modest. Attendance, fees, marks, student self-service, file uploads, and organization-wide role workflows are opportunities for later development rather than claims of the current system.'
)
Page '1.2 Objectives and Scope' @(
'The primary objectives are to provide account registration and login, protect student data, support complete CRUD operations, provide search/filter/pagination, expose dashboard summaries, and preserve data in MongoDB. The project also documents APIs through OpenAPI and Swagger UI.',
'Each authenticated user owns the student records that user creates. All read, update, and delete queries include the authenticated user identifier, so data from one account is not returned through another account’s API request.',
'The deliverable includes source code, an environment template, setup instructions, tests, API documentation, diagram sources, and this project report.'
)
Page '2. Requirements Analysis' @(
'Functional requirements include registration, login, logout, dashboard metrics, creation of students, paginated listing, text search, status filtering, editing, deletion, and a health endpoint. The API returns JSON with meaningful HTTP status codes for success and error conditions.',
'Non-functional requirements include a responsive interface, password hashing, environment-based configuration, manageable error messages, separation of concerns, and a database connection that fails clearly instead of silently switching to mock data.',
'The expected users are administrators who have access to the application and database configuration. The system is suitable for local development and can be configured for a managed MongoDB deployment.'
)
Page '2.1 Feasibility Study' @(
'Technical feasibility is high because the selected JavaScript stack is widely used and runs on common developer machines. Node.js supports the backend, npm manages dependencies, and MongoDB can run locally or through a managed provider.',
'Operational feasibility is supported by the simple browser workflow: register, sign in, use the dashboard, and manage students. The application avoids requiring administrators to understand database commands for routine work.',
'Economic feasibility is favorable for a student project because the stack is open source. Development costs mainly consist of developer time and, if used, a managed database plan or hosting service.'
)
Page '3. Technology Stack' @(
'The frontend uses React 18 for component-based rendering, Vite for the development/build toolchain, React Router for client-side routing, Axios for HTTP calls, and Lucide React for interface icons. The frontend is a single-page application served by the Vite development server during local work.',
'The backend uses Node.js with Express. It uses dotenv for environment configuration, Mongoose for MongoDB models and queries, bcryptjs for password hashing, jsonwebtoken for JWT creation and verification, Helmet for common HTTP security headers, cors for origin control, and express-rate-limit for request throttling.',
'Swagger UI and an OpenAPI YAML file provide interactive API documentation. Node’s built-in test runner is used for backend tests.'
)
Page '3.1 Stack Justification' @(
'React was selected because its component model maps naturally to pages such as Login, Register, Dashboard, and Students. Vite provides rapid development startup and an optimized production bundle. Axios centralizes the API base URL and bearer-token attachment.',
'Express is lightweight and suitable for a small REST API. Mongoose contributes schemas, validation, indexes, timestamps, and useful query helpers over MongoDB. JWT provides stateless authentication between the browser and API.',
'The project uses JavaScript on both client and server. This reduces context switching for student developers while still keeping distinct responsibilities for the frontend and backend.'
)

H1 '4. System Architecture'; Diagram 'Figure 1. Layered system architecture.', @('Administrator using browser','React + Vite frontend','Axios JSON requests with Bearer JWT','Express REST API: routes, controllers, middleware','Mongoose models and validation','MongoDB: users and students collections'); Text 'The browser never connects directly to MongoDB. All state-changing operations pass through authenticated API endpoints, allowing the backend to validate input and apply ownership rules.'; Break
H1 '4.1 Component Design'; Diagram 'Figure 2. Principal backend components.', @('Routes: map URLs to functions','Authentication middleware: verifies token','Controllers: implement request use cases','Models: define MongoDB documents and indexes','Error middleware: sends consistent JSON failures','Swagger UI: publishes API contract'); Text 'This structure avoids placing database code in route definitions and keeps security logic reusable. A controller can be tested and changed without rewriting the application’s routing arrangement.'; Break
H1 '4.2 Authentication Flow'; Diagram 'Figure 3. Login and token flow.', @('Administrator enters email and password','React POST /api/auth/login','Express finds normalized email','bcrypt compares password to passwordHash','Server signs JWT with subject and role','Browser stores token in sessionStorage','Axios sends Authorization: Bearer <token>'); Text 'Protected endpoints invoke requireAuth before controller code. Invalid, absent, or expired tokens receive a 401 response.'; Break
H1 '4.3 Student CRUD Flow'; Diagram 'Figure 4. Student creation flow.', @('Administrator submits student form','Frontend sends POST /api/students','JWT middleware sets req.user','Controller validates fields','Mongoose inserts student with createdBy','API returns 201 JSON response','Frontend refreshes list and dashboard'); Text 'A corresponding GET, PUT, and DELETE flow uses the same ownership filter. This prevents a user from modifying an arbitrary document by guessing its identifier.'; Break
H1 '4.4 Deployment Flow'; Diagram 'Figure 5. Local development deployment.', @('Browser: http://localhost:5173','Vite frontend development server','Express API: http://localhost:5000','MongoDB: mongodb://localhost:27017/student_management','Optional Swagger UI: /api-docs'); Text 'Environment variables allow the API port, database URI, JWT secret, and allowed frontend origin to change between development and deployment.'; Break

Page '5. Database Design' @(
'MongoDB stores two principal collections: users and students. A user document holds a trimmed name, normalized unique email, passwordHash, role, and timestamps. A student document holds identifying and academic fields plus a createdBy reference to the owning user.',
'Mongoose schema definitions establish required fields, string transformations, enumerated status values, timestamps, and indexes. The application does not keep plaintext passwords. The registration controller generates a bcrypt hash before creating a user.',
'The relationship is one-to-many: one user can own many students, while each student contains one createdBy ObjectId. This relationship is enforced in query filters at the application layer.'
)
H1 '5.1 Entity Relationship Diagram'; Diagram 'Figure 6. Entity relationship model.', @('USERS: _id, name, email (unique), passwordHash, role, timestamps','1 user owns many students','STUDENTS: _id, rollNumber, firstName, lastName, email, course, year, status, createdBy, timestamps'); Text 'The users email index enforces account uniqueness. The students collection uses a compound unique index on createdBy and rollNumber, allowing separate users to use the same roll number while preventing a duplicate for the same owner.'; Break
H1 '5.2 Data Dictionary'; Table @(@('Collection / Field','Type / Rule','Purpose'),@('users.email','String, unique, lowercase','Login identity'),@('users.passwordHash','String, required, select false','bcrypt output'),@('students.rollNumber','String, required','Institution identifier'),@('students.year','Integer, 1–8','Academic year'),@('students.status','Active / Inactive / Graduated','Current status'),@('students.createdBy','ObjectId reference','Record ownership')); Text 'The data dictionary documents only the fields used by the implemented application. It is an important reference when adding exports, reports, or additional modules later.'; Break

Page '6. API Design' @(
'The REST API is served beneath /api. Public routes include GET /api/health, POST /api/auth/register, and POST /api/auth/login. Student routes require a bearer token and include dashboard statistics, listing, creation, single-record retrieval, update, and deletion.',
'OpenAPI 3.0.3 definitions are stored in docs/openapi.yaml. Swagger UI is available from /api-docs when the backend is running. This provides a human-readable contract for frontend development, testing, and future integration.',
'Responses use JSON and generally include a success Boolean, a message when useful, and data payloads. Input errors use 400, authentication failures use 401, missing resources use 404, duplicate conflicts use 409, and unexpected failures use centralized error handling.'
)
H1 '6.1 Endpoint Summary'; Table @(@('Method','Endpoint','Purpose'),@('POST','/api/auth/register','Create administrator account'),@('POST','/api/auth/login','Authenticate and return JWT'),@('GET','/api/students/dashboard','Return student totals'),@('GET / POST','/api/students','List or create students'),@('GET / PUT / DELETE','/api/students/:id','Read, update, or delete one student'),@('GET','/api/health','Confirm API availability')); Text 'List requests accept page, limit, search, and status query parameters. The limit is capped at 100 to prevent unbounded page sizes.'; Break
H1 '6.2 API Request and Response Example'; Text 'A create-student request requires Authorization: Bearer <JWT> and JSON content. The server validates all required values before inserting the document.'; Code @'
POST /api/students
{
  "rollNumber": "STU-1001",
  "firstName": "Aarav",
  "lastName": "Shah",
  "email": "aarav.shah@example.com",
  "course": "Computer Applications",
  "year": 1,
  "status": "Active"
}
'@; Text 'On success the server responds with HTTP 201 and the created student. A duplicate roll number for the same owner is translated into a conflict response by error handling.'; Break

H1 '7. Frontend Implementation'; Text 'The frontend defines routed pages for registration, login, dashboard, and student management. AuthContext keeps the current user in React state and uses sessionStorage so refreshes within the browser session preserve sign-in state. A protected-route component restricts authenticated pages.'; Text 'The Students page coordinates search text, status filter, page number, loading state, error state, and form interaction. It calls the API through a shared Axios instance rather than constructing URLs independently in every component.'; Text 'The interface uses native HTML inputs with required, minLength, and maxLength attributes for immediate browser feedback. Server validation remains authoritative because client checks can be bypassed.'; Break
H1 '7.1 Frontend Authentication Code'; Text 'The following selected logic stores the issued token and user data after a successful registration or login. Axios subsequently attaches the token to protected requests.'; Code @'
const { data } = await api.post(`/auth/${path}`, payload);
sessionStorage.setItem('sms_token', data.data.token);
sessionStorage.setItem('sms_user', JSON.stringify(data.data.user));
setUser(data.data.user);
'@; Text 'sessionStorage clears when the browser session ends, which limits persistence compared with localStorage. A production review may choose HttpOnly secure cookies with a CSRF strategy instead.'; Break
H1 '7.2 Axios Request Interceptor'; Code @'
api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('sms_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
'@; Text 'Centralizing this interceptor ensures that the dashboard and student pages consistently send credentials without duplicating token code.'; Break

H1 '8. Backend Implementation'; Text 'The server imports dotenv configuration, connects MongoDB through a dedicated configuration module, and starts Express only after a successful database connection. This design gives a clear startup failure if the database URI is absent or the database cannot be reached.'; Text 'The Express app enables Helmet, restricted CORS, a 20 KB JSON body limit, rate limiting, route modules, Swagger UI, a 404 handler, and a centralized error handler. Route modules remain concise because controller functions contain the application behavior.'; Text 'Controllers are asynchronous and forward unexpected errors to centralized middleware. This minimizes repeated try/catch response formatting throughout the project.'; Break
H1 '8.1 Registration Logic'; Text 'Registration checks name length, email syntax, and password length before checking for an existing email. It normalizes email values and stores a bcrypt hash in passwordHash. The corrected User schema uses that same passwordHash field and excludes it from standard queries.'; Code @'
const normalized = email.trim().toLowerCase();
if (await User.exists({ email: normalized })) {
  return res.status(409).json({ success:false, message:'An account with this email already exists.' });
}
const user = await User.create({
  name: name.trim(), email: normalized,
  passwordHash: await bcrypt.hash(password, 12)
});
'@; Text 'The API sends only a safe user projection and a signed token; it does not return the stored hash.'; Break
H1 '8.2 Authorization Middleware'; Code @'
const header = req.headers.authorization || '';
const token = header.startsWith('Bearer ') ? header.slice(7) : null;
if (!token) return res.status(401).json({ success:false, message:'Authentication required.' });
const payload = jwt.verify(token, process.env.JWT_SECRET);
req.user = { id: payload.sub, role: payload.role };
next();
'@; Text 'JWT verification is performed before protected controllers. The token subject becomes the record-owner identifier used in database filters.'; Break
H1 '8.3 Student Query and Ownership'; Code @'
const filter = { createdBy: req.user.id };
const item = await Student.findOne({
  _id: req.params.id,
  createdBy: req.user.id
});
'@; Text 'Both the list filter and individual-record filter are essential. Merely protecting an endpoint with a token would not be enough if a valid user could request another user’s document ID.'; Break
H1 '8.4 Search and Pagination'; Text 'The list controller parses a positive page number and clamps the requested page size between 1 and 100. Search terms are limited in length and regular-expression characters are escaped before a case-insensitive search across name, roll number, email, and course fields.'; Text 'The query uses skip and limit and returns pagination metadata: current page, limit, total records, and total page count. For very large datasets, future versions could use cursor pagination and text indexes.'; Break

Page '9. Validation and Error Handling' @(
'Validation is performed at more than one layer. The browser provides basic required-field and length constraints. Controller helpers validate the API request body before persistence. Mongoose schemas provide another layer of protection for document shape and field rules.',
'For student input, roll number, first name, last name, email, course, and year are required. Academic year must be an integer from 1 to 8; status must be Active, Inactive, or Graduated; and email syntax is checked with a conventional expression.',
'The API distinguishes invalid object IDs, not-found records, validation failures, duplicate-key conflicts, and unexpected errors. Consistent error objects simplify frontend error display and debugging.'
)
Page '10. Security Considerations' @(
'Passwords are hashed using bcrypt with a work factor of 12 before storage. The passwordHash field is configured as select: false so normal queries do not accidentally return it. Passwords are never stored or returned in plaintext.',
'JWT secrets and database URIs are kept in backend/.env, which is excluded by .gitignore. Helmet supplies baseline HTTP response headers, CORS restricts accepted browser origins, express.json limits request size, and request rate limiting reduces basic abuse.',
'Production work should use HTTPS, secret rotation, dependency updates, managed database network controls, backups, structured audit logs, monitoring, and a formal review of client-side token storage.'
)
Page '11. Testing Strategy' @(
'The backend uses Node’s built-in test runner. Existing tests exercise email validation and student validation. A regression test verifies that the User model accepts the passwordHash field produced by the registration controller, preventing recurrence of the earlier schema/controller mismatch.',
'Manual tests should cover registration, duplicate email handling, login, logout, unauthorized API access, student creation, search, filter, pagination, update, deletion, database persistence, and responsive views. Swagger UI can be used for direct API checks.',
'The command npm run test:backend executes backend tests. The command npm run build creates an optimized frontend build. Runtime results depend on installed dependencies and a reachable MongoDB configuration.'
)
H1 '11.1 Test Cases'; Table @(@('ID','Scenario','Expected result'),@('T01','Register valid user','201 and JWT returned'),@('T02','Register duplicate email','409 conflict'),@('T03','Login with invalid password','401 unauthorized'),@('T04','Create student with missing course','400 validation error'),@('T05','Search owned records','Filtered paginated list'),@('T06','Request other user student','404 not found'),@('T07','Build frontend','Vite build completes')); Text 'Tests should be recorded with actual execution dates and results when used for formal submission.'; Break
Page '12. Installation and User Guide' @(
'After cloning the repository, install root dependencies with npm install and application dependencies with npm run install:all. Copy backend/.env.example to backend/.env, set a strong JWT_SECRET, and configure MONGODB_URI. The local default is mongodb://localhost:27017/student_management.',
'Start MongoDB first when using the local URI. Start both frontend and backend from the project root with npm run dev. The browser application is available at http://localhost:5173; the API is at http://localhost:5000; Swagger UI is at http://localhost:5000/api-docs.',
'A detailed clone-to-run guide is included in docs/SETUP.md. The .gitignore rules prevent environment secrets, node_modules, generated builds, logs, and common editor files from being committed.'
)
Page '13. Limitations and Future Enhancements' @(
'The present implementation is an administrator-focused system. It does not provide separate student accounts, multi-level staff permissions, attendance, examinations, fees, document uploads, password reset, CSV export, notification workflows, audit screens, or real-time updates.',
'Future work can introduce role-based access control, a student self-service portal, attendance and grading modules, import/export tools, email verification, password recovery, refresh-token rotation, container deployment, CI pipelines, integration tests, and browser end-to-end tests.',
'Performance improvements for larger datasets can include text indexes, cursor pagination, caching of dashboard counts, and database monitoring. Any extension should preserve ownership checks and document API changes in OpenAPI.'
)
Page '14. Conclusion' @(
'CampusDesk demonstrates an end-to-end student record management application using a modern JavaScript stack. It separates React interface concerns from Express API behavior and MongoDB persistence while maintaining secure authentication, validation, ownership filters, and documented routes.',
'The project meets its core objective of providing authenticated student CRUD operations with search, filtering, pagination, dashboard totals, setup documentation, and baseline tests. Its modular architecture provides a practical foundation for iterative enhancement.',
'Before production deployment or formal evaluation, the system should be run with the intended database and environment, and manual/integration test evidence should be recorded.'
)
H1 'References'; Bullet @('React Documentation — https://react.dev/','Vite Documentation — https://vite.dev/','Express Documentation — https://expressjs.com/','MongoDB Documentation — https://www.mongodb.com/docs/','Mongoose Documentation — https://mongoosejs.com/docs/','OpenAPI Specification — https://spec.openapis.org/','JSON Web Token Introduction — https://jwt.io/introduction','OWASP Application Security Verification Standard — https://owasp.org/www-project-application-security-verification-standard/'); Text 'Project-specific references: README.md, docs/SETUP.md, docs/DATABASE.md, docs/openapi.yaml, docs/TESTING.md, and source files in frontend/ and backend/.'; Break
H1 'Appendix A — Project Structure'; Code @'
student-management-system/
  frontend/     React + Vite application
  backend/      Express API, Mongoose models, tests, seed script
  docs/         API specification, diagrams, setup, report material
  package.json  Root development and orchestration scripts
'@; Text 'The source is organized by responsibility: pages and components in the frontend; configuration, controllers, middleware, models, routes, and utility validators in the backend.'; Break
H1 'Appendix B — Environment Template'; Code @'
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student_management
JWT_SECRET=replace-with-a-unique-secret-at-least-24-characters
JWT_EXPIRES_IN=2h
CLIENT_ORIGIN=http://localhost:5173
'@; Text 'Do not commit a real backend/.env file. For MongoDB Atlas, replace the URI with a private connection string and configure database permissions and network access.'; Break
H1 'Appendix C — Glossary'; Table @(@('Term','Meaning'),@('API','Application Programming Interface'),@('CRUD','Create, Read, Update, Delete'),@('JWT','Signed token used for authenticated requests'),@('Mongoose','ODM library connecting Node.js to MongoDB'),@('ODM','Object Document Mapper'),@('REST','HTTP-oriented resource API style'),@('SPA','Single-Page Application')); Text 'End of report.'

$doc.Repaginate() | Out-Null
$doc.SaveAs2($output, 16)
$doc.Close()
$word.Quit()
Write-Output "Created: $output"
