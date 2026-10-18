# Testing and Verification

## Automated tests included
`backend/test/validators.test.js` covers valid/invalid email values, missing student fields, valid student input, and academic-year validation.

Run on Windows after installing dependencies:
```powershell
npm install
npm run install:all
npm test --prefix backend
```

## Manual acceptance checklist
- [ ] MongoDB starts and backend connects to the intended database.
- [ ] `GET http://localhost:5000/api/health` returns `success: true`.
- [ ] Register rejects malformed email and passwords shorter than 8 characters.
- [ ] Register creates a user whose stored password is a hash, not plaintext.
- [ ] Login rejects incorrect credentials and returns a token for correct credentials.
- [ ] Dashboard and student endpoints reject requests without a valid bearer token.
- [ ] Create a student and verify the response status is 201.
- [ ] Refresh the UI and confirm the student remains in the list.
- [ ] Edit a student's course/status and verify the changed values persist.
- [ ] Search by name, roll number, email, and course.
- [ ] Filter by Active, Inactive, and Graduated status.
- [ ] Delete a student and confirm it no longer appears.
- [ ] Duplicate roll number for the same user returns a conflict response.
- [ ] A user cannot read/update/delete another user's student record.
- [ ] Invalid object IDs return 400 and unknown records return 404.
- [ ] Disconnect MongoDB and verify the API fails clearly rather than returning mock data.
- [ ] Test responsive layout and keyboard navigation in a browser.
- [ ] Run `npm run build` and fix any reported build errors.

## Status reporting
No test pass/fail results are prefilled. Execute the commands and checklist in the target environment, then record the actual result, date, software versions, and any failures here. Unit tests do not replace database integration or end-to-end testing.
