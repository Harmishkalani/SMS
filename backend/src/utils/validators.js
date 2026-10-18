export function validEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '')); }
export function validateStudent(body) {
  const errors = [];
  for (const key of ['rollNumber','firstName','lastName','email','course']) {
    if (typeof body[key] !== 'string' || !body[key].trim()) errors.push(`${key} is required.`);
  }
  if (body.email && !validEmail(body.email)) errors.push('A valid email address is required.');
  const year = Number(body.year);
  if (!Number.isInteger(year) || year < 1 || year > 8) errors.push('year must be an integer from 1 to 8.');
  if (body.status && !['Active','Inactive','Graduated'].includes(body.status)) errors.push('status must be Active, Inactive, or Graduated.');
  return errors;
}
