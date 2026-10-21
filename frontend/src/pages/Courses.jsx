import { useCallback, useEffect, useState } from 'react';
import { Plus, BookOpen, Pencil, Trash2, X, IndianRupee, RefreshCw } from 'lucide-react';
import api from '../services/api.js';

export default function Courses() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [notice, setNotice]     = useState('');
  const [modal, setModal]       = useState(false);
  const [editing, setEditing]   = useState(null);
  const [busy, setBusy]         = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm]         = useState({ name: '', fees: '' });
  const [formErr, setFormErr]   = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const { data } = await api.get('/courses');
      setItems(data.data);
    } catch (e) { setError(e.response?.data?.message || 'Unable to load courses.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() { setForm({ name: '', fees: '' }); setFormErr(''); setEditing(null); setModal(true); }
  function openEdit(c)  { setForm({ name: c.name, fees: String(c.fees) }); setFormErr(''); setEditing(c); setModal(true); }

  async function save(e) {
    e.preventDefault(); setFormErr('');
    if (!form.name.trim()) return setFormErr('Course name is required.');
    if (!form.fees || isNaN(Number(form.fees)) || Number(form.fees) < 0) return setFormErr('Enter a valid fee amount.');
    setBusy(true);
    try {
      if (editing) await api.put(`/courses/${editing._id}`, form);
      else         await api.post('/courses', form);
      setModal(false);
      setNotice(editing ? 'Course updated successfully.' : 'Course created successfully.');
      setTimeout(() => setNotice(''), 3500);
      await load();
    } catch (e) { setFormErr(e.response?.data?.message || 'Could not save course.'); }
    finally { setBusy(false); }
  }

  async function remove() {
    if (!deleteTarget) return;
    try {
      await api.delete(`/courses/${deleteTarget._id}`);
      setDeleteTarget(null);
      setNotice('Course deleted.');
      setTimeout(() => setNotice(''), 3500);
      await load();
    } catch (e) { setError(e.response?.data?.message || 'Unable to delete course.'); }
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">ACADEMICS</div>
          <h1>Courses</h1>
          <p>Manage course catalogue and associated fee structure.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={17}/> Add course</button>
      </div>

      {notice && <div className="notice-success">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss"><X size={16}/></button></div>}
      {error  && <div className="notice-error">{error}<button onClick={() => setError('')} aria-label="Dismiss"><X size={16}/></button></div>}

      <section className="panel table-panel">
        <div className="table-toolbar">
          <div className="record-count">
            <strong>All Courses</strong>
            <span>{items.length} records</span>
          </div>
          <button className="icon-button refresh-button" onClick={load} title="Refresh" aria-label="Refresh courses"><RefreshCw size={16}/></button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>COURSE NAME</th>
                <th>FEES (₹)</th>
                <th>CREATED</th>
                <th className="actions-head">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5"><div className="table-loading"><span className="spinner"/> Loading courses…</div></td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan="5">
                  <div className="empty-state">
                    <div className="empty-icon"><BookOpen size={24}/></div>
                    <strong>No courses yet</strong>
                    <p>Add your first course to get started.</p>
                    <button className="btn btn-primary" onClick={openCreate}><Plus size={16}/> Add course</button>
                  </div>
                </td></tr>
              ) : items.map((c, i) => (
                <tr key={c._id}>
                  <td><span className="roll-number">{i + 1}</span></td>
                  <td>
                    <div className="student-cell">
                      <div className="course-icon-cell"><BookOpen size={15}/></div>
                      <strong style={{color:'#29364a',fontSize:'12px'}}>{c.name}</strong>
                    </div>
                  </td>
                  <td>
                    <span className="fee-amount">
                      <IndianRupee size={13}/>{Number(c.fees).toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td>{new Date(c.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</td>
                  <td>
                    <div className="row-actions">
                      <button className="icon-button edit-button" onClick={() => openEdit(c)} title="Edit course" aria-label={`Edit ${c.name}`}><Pencil size={16}/></button>
                      <button className="icon-button delete-button" onClick={() => setDeleteTarget(c)} title="Delete course" aria-label={`Delete ${c.name}`}><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Course Modal */}
      {modal && (
        <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setModal(false); }}>
          <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="course-modal-title">
            <div className="modal-heading">
              <div>
                <div className="eyebrow">COURSE</div>
                <h2 id="course-modal-title">{editing ? 'Edit course' : 'Add a course'}</h2>
                <p>{editing ? 'Update course details below.' : 'Enter details for the new course.'}</p>
              </div>
              <button className="icon-button" onClick={() => setModal(false)} aria-label="Close"><X size={19}/></button>
            </div>
            <form onSubmit={save} noValidate>
              <div className="field">
                <span>Course Name <b>*</b></span>
                <input id="course-name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Bachelor of Computer Science" maxLength={120} autoFocus/>
              </div>
              <div className="field">
                <span>Course Fees (₹) <b>*</b></span>
                <input id="course-fees" type="number" min="0" step="0.01" value={form.fees}
                  onChange={e => setForm(f => ({ ...f, fees: e.target.value }))} placeholder="e.g. 45000"/>
              </div>
              {formErr && <div className="form-error">{formErr}</div>}
              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : editing ? 'Update course' : 'Add course'}</button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="modal-backdrop">
          <section className="confirm-card" role="alertdialog" aria-modal="true" aria-labelledby="del-course-title">
            <div className="confirm-icon"><Trash2 size={22}/></div>
            <h2 id="del-course-title">Delete course?</h2>
            <p>This will permanently delete <strong>{deleteTarget.name}</strong>. This action cannot be undone.</p>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={remove}>Delete course</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
