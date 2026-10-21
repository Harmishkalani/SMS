import { useEffect, useState } from 'react';
import api from '../services/api.js';

const empty = { rollNumber:'', firstName:'', lastName:'', email:'', course:'', year:'1', status:'Active' };

export default function StudentForm({ initial, onCancel, onSubmit, busy }) {
  const [form, setForm]       = useState(initial || empty);
  const [error, setError]     = useState('');
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => { setForm(initial || empty); }, [initial]);

  useEffect(() => {
    setLoadingCourses(true);
    api.get('/courses')
      .then(r => setCourses(r.data.data || []))
      .catch(() => setCourses([]))
      .finally(() => setLoadingCourses(false));
  }, []);

  function change(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function submit(e) {
    e.preventDefault(); setError('');
    const textFields = ['rollNumber','firstName','lastName','email','course','year'];
    if (textFields.some(k => !String(form[k]).trim())) { setError('Please complete all required fields.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError('Enter a valid email address.'); return; }
    if (Number(form.year) < 1 || Number(form.year) > 8) { setError('Year must be between 1 and 8.'); return; }
    try { await onSubmit({ ...form, year: Number(form.year) }); }
    catch (err) { setError(err.response?.data?.errors?.join(' ') || err.response?.data?.message || 'Unable to save student.'); }
  }

  return (
    <form className="student-form" onSubmit={submit}>
      <div className="form-grid">
        {[
          ['rollNumber', 'Roll number',    'e.g. STU-1024'],
          ['firstName',  'First name',     'Enter first name'],
          ['lastName',   'Last name',      'Enter last name'],
          ['email',      'Email address',  'student@example.com'],
        ].map(([name, label, placeholder]) => (
          <label className="field" key={name}>
            <span>{label} <b>*</b></span>
            <input name={name} value={form[name]} onChange={change} placeholder={placeholder} maxLength={254} required/>
          </label>
        ))}

        {/* Course dropdown */}
        <label className="field">
          <span>Course / programme <b>*</b></span>
          {loadingCourses ? (
            <select disabled><option>Loading courses…</option></select>
          ) : courses.length === 0 ? (
            <select name="course" value={form.course} onChange={change}>
              <option value="">No courses found — add one first</option>
            </select>
          ) : (
            <select name="course" value={form.course} onChange={change} required>
              <option value="">Select a course…</option>
              {courses.map(c => (
                <option key={c._id} value={c.name}>
                  {c.name} — ₹{Number(c.fees).toLocaleString('en-IN')}
                </option>
              ))}
            </select>
          )}
        </label>

        {/* Year */}
        <label className="field">
          <span>Academic year <b>*</b></span>
          <select name="year" value={form.year} onChange={change}>
            {[1,2,3,4,5,6,7,8].map(y => <option key={y} value={y}>Year {y}</option>)}
          </select>
        </label>

        {/* Status */}
        <label className="field">
          <span>Status</span>
          <select name="status" value={form.status} onChange={change}>
            <option>Active</option>
            <option>Inactive</option>
            <option>Graduated</option>
          </select>
        </label>
      </div>

      {error && <div className="form-error" role="alert">{error}</div>}

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" disabled={busy || loadingCourses}>
          {busy ? 'Saving…' : initial ? 'Save changes' : 'Create student'}
        </button>
      </div>
    </form>
  );
}
