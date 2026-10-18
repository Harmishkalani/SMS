# Database Design

Database: `student_management` (local default). MongoDB creates collections when the first document is written.

## `users`
| Field | Type | Rules | Purpose |
|---|---|---|---|
| `_id` | ObjectId | MongoDB primary key | User identifier |
| `name` | String | Required, trimmed, 2–80 chars | Display name |
| `email` | String | Required, lowercase, trimmed, unique | Login identity |
| `passwordHash` | String | Required, excluded from normal queries | bcrypt password hash |
| `role` | String | `admin` | Current application role |
| `createdAt`, `updatedAt` | Date | Mongoose timestamps | Audit metadata |

Unique index: `{ email: 1 }`.

## `students`
| Field | Type | Rules | Purpose |
|---|---|---|---|
| `_id` | ObjectId | MongoDB primary key | Student identifier |
| `rollNumber` | String | Required, trimmed, uppercase, max 30 | Student's institution roll number |
| `firstName`, `lastName` | String | Required, trimmed, max 80 | Student name |
| `email` | String | Required, normalized lowercase | Contact email |
| `course` | String | Required, max 120 | Programme/course |
| `year` | Number | Integer expected by API, 1–8 | Academic year |
| `status` | String | `Active`, `Inactive`, or `Graduated` | Academic status |
| `createdBy` | ObjectId | Required reference to `users._id` | Record owner |
| `createdAt`, `updatedAt` | Date | Mongoose timestamps | Record metadata |

Indexes: unique compound `{ createdBy: 1, rollNumber: 1 }`; lookup/sort support `{ createdBy: 1, lastName: 1, firstName: 1 }`.

## Relationship
One user can own many student records. Every student has exactly one `createdBy` reference. This is a one-to-many relationship. The API scopes reads, updates, and deletes by both student ID and authenticated user ID.

## Example student document
```json
{
  "_id": "<generated ObjectId>",
  "rollNumber": "STU-1001",
  "firstName": "Aarav",
  "lastName": "Shah",
  "email": "aarav.shah@example.com",
  "course": "Computer Applications",
  "year": 1,
  "status": "Active",
  "createdBy": "<user ObjectId>",
  "createdAt": "<ISO date>",
  "updatedAt": "<ISO date>"
}
```

The example values are illustrative, not a claim that a database has already been seeded. To seed records, register in the UI, then run `npm run seed --prefix backend -- your-registered-email@example.com` from the root. Confirm the database URI points to the intended database.
