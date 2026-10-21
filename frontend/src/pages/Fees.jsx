import { useCallback, useEffect, useRef, useState } from 'react';
import { Search, IndianRupee, X, Printer, CheckCircle, Clock, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import api from '../services/api.js';

/* ---------- Receipt printable component ---------- */
function Receipt({ payment, onClose }) {
  const ref = useRef();
  function handlePrint() {
    const content = ref.current.innerHTML;
    const win = window.open('', '_blank', 'width=700,height=900');
    win.document.write(`<!DOCTYPE html><html><head><title>Fee Receipt – ${payment.receiptNo}</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:Arial,sans-serif;padding:36px;color:#1a2535}
      .header{text-align:center;border-bottom:2px solid #4169e1;padding-bottom:18px;margin-bottom:22px}
      .header h1{font-size:22px;color:#4169e1;letter-spacing:-0.5px}
      .header p{font-size:12px;color:#6c7a8d;margin-top:5px}
      .receipt-no{text-align:right;font-size:11px;color:#6c7a8d;margin-bottom:16px}
      .receipt-no strong{color:#1a2535;font-size:13px}
      .grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px}
      .section{border:1px solid #e0e6f0;border-radius:8px;padding:14px}
      .section h3{font-size:10px;letter-spacing:1px;color:#8a95a5;margin-bottom:10px;text-transform:uppercase}
      .row{display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px}
      .row span{color:#6c7a8d}
      .row strong{color:#1a2535}
      .total-box{background:#4169e1;color:white;border-radius:8px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
      .total-box span{font-size:13px;opacity:.85}
      .total-box strong{font-size:22px;font-weight:700}
      .paid-stamp{text-align:center;padding:10px;border:3px solid #16a34a;border-radius:8px;color:#16a34a;font-size:18px;font-weight:700;letter-spacing:2px;margin-bottom:16px}
      .footer{text-align:center;font-size:10px;color:#9ba5b2;border-top:1px solid #e5e9f0;padding-top:14px}
      @media print{body{padding:20px}}
    </style></head><body>${content}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 300);
  }

  const s = payment.student;
  const c = payment.course;
  const paidDate = new Date(payment.paidAt).toLocaleString('en-IN', { day:'2-digit', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' });

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="modal-card receipt-modal" role="dialog" aria-modal="true" aria-labelledby="receipt-title">
        <div className="modal-heading">
          <div>
            <div className="eyebrow">PAYMENT RECEIPT</div>
            <h2 id="receipt-title">Fee Receipt</h2>
            <p>Payment recorded successfully.</p>
          </div>
          <div style={{display:'flex',gap:'8px'}}>
            <button className="btn btn-primary" onClick={handlePrint} style={{gap:'7px'}}><Printer size={15}/> Print</button>
            <button className="icon-button" onClick={onClose} aria-label="Close"><X size={19}/></button>
          </div>
        </div>

        {/* Printable area */}
        <div ref={ref}>
          <div className="header" style={{textAlign:'center',borderBottom:'2px solid #4169e1',paddingBottom:'16px',marginBottom:'20px'}}>
            <div style={{fontSize:'20px',color:'#4169e1',fontWeight:800,letterSpacing:'-0.5px'}}>🎓 CampusDesk</div>
            <div style={{fontSize:'11px',color:'#6c7a8d',marginTop:'4px'}}>Student Management System — Official Fee Receipt</div>
          </div>
          <div style={{textAlign:'right',fontSize:'11px',color:'#6c7a8d',marginBottom:'14px'}}>
            Receipt No: <strong style={{color:'#1a2535'}}>{payment.receiptNo}</strong><br/>
            Date: <strong style={{color:'#1a2535'}}>{paidDate}</strong>
          </div>
          <div className="receipt-grid">
            <div className="receipt-section">
              <div className="receipt-section-title">STUDENT DETAILS</div>
              <div className="receipt-row"><span>Name</span><strong>{s.firstName} {s.lastName}</strong></div>
              <div className="receipt-row"><span>Roll No</span><strong>{s.rollNumber}</strong></div>
              <div className="receipt-row"><span>Email</span><strong>{s.email}</strong></div>
            </div>
            <div className="receipt-section">
              <div className="receipt-section-title">COURSE DETAILS</div>
              <div className="receipt-row"><span>Course</span><strong>{c.name}</strong></div>
              <div className="receipt-row"><span>Course Fee</span><strong>₹{Number(c.fees).toLocaleString('en-IN')}</strong></div>
              {payment.remarks && <div className="receipt-row"><span>Remarks</span><strong>{payment.remarks}</strong></div>}
            </div>
          </div>
          <div className="receipt-total">
            <span>Amount Paid</span>
            <strong>₹{Number(payment.amount).toLocaleString('en-IN')}</strong>
          </div>
          <div className="receipt-stamp">✓ PAID</div>
          <div style={{textAlign:'center',fontSize:'10px',color:'#9ba5b2',borderTop:'1px solid #e5e9f0',paddingTop:'12px',marginTop:'10px'}}>
            This is a computer-generated receipt and does not require a signature.
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- Main Fees Page ---------- */
export default function Fees() {
  const [payments, setPayments]   = useState([]);
  const [pagination, setPagination] = useState({ page:1, pages:1, total:0 });
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [modal, setModal]         = useState(false);
  const [receipt, setReceipt]     = useState(null);

  // Student search
  const [query, setQuery]         = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searching, setSearching] = useState(false);

  // Courses dropdown
  const [courses, setCourses]     = useState([]);
  const [form, setForm]           = useState({ courseId: '', amount: '', remarks: '' });
  const [formErr, setFormErr]     = useState('');
  const [busy, setBusy]           = useState(false);
  const searchRef = useRef();

  const loadPayments = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const { data } = await api.get('/fees', { params: { page, limit: 8 } });
      setPayments(data.data);
      setPagination(data.pagination);
    } catch (e) { setError(e.response?.data?.message || 'Unable to load payments.'); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { loadPayments(); }, [loadPayments]);

  async function searchStudents(q) {
    if (!q.trim()) { setSuggestions([]); return; }
    setSearching(true);
    try {
      const { data } = await api.get('/fees/search-students', { params: { q } });
      setSuggestions(data.data);
    } catch { setSuggestions([]); }
    finally { setSearching(false); }
  }

  function openModal() {
    setQuery(''); setSuggestions([]); setSelectedStudent(null);
    setForm({ courseId: '', amount: '', remarks: '' });
    setFormErr('');
    api.get('/courses').then(r => setCourses(r.data.data)).catch(() => {});
    setModal(true);
  }

  function pickStudent(s) {
    setSelectedStudent(s);
    setQuery(`${s.firstName} ${s.lastName} (${s.rollNumber})`);
    setSuggestions([]);
  }

  async function submit(e) {
    e.preventDefault(); setFormErr('');
    if (!selectedStudent) return setFormErr('Please search and select a student.');
    if (!form.courseId)   return setFormErr('Please select a course.');
    if (!form.amount || Number(form.amount) <= 0) return setFormErr('Enter a valid amount.');
    setBusy(true);
    try {
      const { data } = await api.post('/fees', {
        studentId: selectedStudent._id,
        courseId:  form.courseId,
        amount:    Number(form.amount),
        remarks:   form.remarks
      });
      setModal(false);
      setReceipt(data.data);
      await loadPayments();
    } catch (e) { setFormErr(e.response?.data?.message || 'Could not record payment.'); }
    finally { setBusy(false); }
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">FINANCE</div>
          <h1>Fee Payments</h1>
          <p>Record and track student fee payments with printable receipts.</p>
        </div>
        <button className="btn btn-primary" onClick={openModal}><IndianRupee size={17}/> Record payment</button>
      </div>

      {error && <div className="notice-error">{error}<button onClick={() => setError('')} aria-label="Dismiss"><X size={16}/></button></div>}

      <section className="panel table-panel">
        <div className="table-toolbar">
          <div className="record-count">
            <strong>All Payments</strong>
            <span>{pagination.total} records</span>
          </div>
          <button className="icon-button refresh-button" onClick={loadPayments} title="Refresh" aria-label="Refresh"><RefreshCw size={16}/></button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>RECEIPT NO</th>
                <th>STUDENT</th>
                <th>COURSE</th>
                <th>AMOUNT</th>
                <th>DATE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6"><div className="table-loading"><span className="spinner"/> Loading payments…</div></td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan="6">
                  <div className="empty-state">
                    <div className="empty-icon"><IndianRupee size={24}/></div>
                    <strong>No payments recorded yet</strong>
                    <p>Record a student fee payment to see it listed here.</p>
                    <button className="btn btn-primary" onClick={openModal}><IndianRupee size={16}/> Record payment</button>
                  </div>
                </td></tr>
              ) : payments.map(p => (
                <tr key={p._id}>
                  <td><span className="roll-number">{p.receiptNo}</span></td>
                  <td>
                    <div className="student-cell">
                      <div className="student-avatar">{p.student?.firstName?.[0]}{p.student?.lastName?.[0]}</div>
                      <div>
                        <strong style={{fontSize:'11px',color:'#29364a'}}>{p.student?.firstName} {p.student?.lastName}</strong>
                        <small style={{display:'block',fontSize:'10px',color:'#909aaa'}}>{p.student?.rollNumber}</small>
                      </div>
                    </div>
                  </td>
                  <td style={{fontSize:'11px'}}>{p.course?.name}</td>
                  <td><span className="fee-amount"><IndianRupee size={12}/>{Number(p.amount).toLocaleString('en-IN')}</span></td>
                  <td style={{fontSize:'11px',color:'#6c7a8d'}}>{new Date(p.paidAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</td>
                  <td><span className="status-pill paid-pill"><CheckCircle size={10}/> Paid</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-pagination">
          <span>Showing <strong>{payments.length ? ((page-1)*8+1) : 0}–{Math.min(page*8, pagination.total)}</strong> of <strong>{pagination.total}</strong> payments</span>
          <div className="pagination-controls">
            <button className="icon-button" disabled={page <= 1 || loading} onClick={() => setPage(p => p-1)} aria-label="Previous page"><ChevronLeft size={17}/></button>
            <span>Page <strong>{page}</strong> of <strong>{Math.max(1, pagination.pages)}</strong></span>
            <button className="icon-button" disabled={page >= pagination.pages || loading} onClick={() => setPage(p => p+1)} aria-label="Next page"><ChevronRight size={17}/></button>
          </div>
        </div>
      </section>

      {/* Record Payment Modal */}
      {modal && (
        <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setModal(false); }}>
          <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="fee-modal-title">
            <div className="modal-heading">
              <div>
                <div className="eyebrow">FEE PAYMENT</div>
                <h2 id="fee-modal-title">Record payment</h2>
                <p>Search for a student, select a course and enter the amount paid.</p>
              </div>
              <button className="icon-button" onClick={() => setModal(false)} aria-label="Close"><X size={19}/></button>
            </div>
            <form onSubmit={submit} noValidate>
              {/* Student search */}
              <div className="field" style={{position:'relative'}}>
                <span>Search Student <b>*</b></span>
                <div className="fee-search-wrap">
                  <Search size={15} style={{color:'#a0a8b5'}}/>
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={e => { setQuery(e.target.value); setSelectedStudent(null); searchStudents(e.target.value); }}
                    placeholder="Search by name, roll number or email…"
                    autoComplete="off"
                    id="fee-student-search"
                  />
                  {searching && <span className="spinner" style={{width:'14px',height:'14px',marginLeft:'auto'}}/>}
                </div>
                {suggestions.length > 0 && (
                  <ul className="student-suggestions">
                    {suggestions.map(s => (
                      <li key={s._id} onClick={() => pickStudent(s)} tabIndex={0} onKeyDown={e => e.key==='Enter' && pickStudent(s)}>
                        <div className="student-avatar" style={{width:'30px',height:'30px',fontSize:'9px'}}>{s.firstName?.[0]}{s.lastName?.[0]}</div>
                        <div>
                          <strong>{s.firstName} {s.lastName}</strong>
                          <small>{s.rollNumber} · {s.email}</small>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {selectedStudent && (
                  <div className="selected-student">
                    <CheckCircle size={14} style={{color:'#16a34a'}}/> {selectedStudent.firstName} {selectedStudent.lastName} — <span>{selectedStudent.rollNumber}</span>
                  </div>
                )}
              </div>

              {/* Course */}
              <div className="field">
                <span>Course <b>*</b></span>
                <select id="fee-course" value={form.courseId} onChange={e => {
                  const course = courses.find(c => c._id === e.target.value);
                  setForm(f => ({ ...f, courseId: e.target.value, amount: course ? String(course.fees) : '' }));
                }}>
                  <option value="">Select a course…</option>
                  {courses.map(c => <option key={c._id} value={c._id}>{c.name} — ₹{Number(c.fees).toLocaleString('en-IN')}</option>)}
                </select>
              </div>

              {/* Amount */}
              <div className="field">
                <span>Amount Paid (₹) <b>*</b></span>
                <input id="fee-amount" type="number" min="1" step="0.01" value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="e.g. 45000"/>
              </div>

              {/* Remarks */}
              <div className="field">
                <span>Remarks <small style={{color:'#a0a8b5'}}>(optional)</small></span>
                <input id="fee-remarks" value={form.remarks} onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))}
                  placeholder="e.g. Semester 1 fee, partial payment…" maxLength={300}/>
              </div>

              {formErr && <div className="form-error">{formErr}</div>}
              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Recording…' : 'Mark as paid & generate receipt'}</button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Receipt Modal */}
      {receipt && <Receipt payment={receipt} onClose={() => setReceipt(null)}/>}
    </>
  );
}
