import { Link } from 'react-router-dom';
export default function NotFound(){return <div className="not-found"><div className="eyebrow">404 · PAGE NOT FOUND</div><h1>Looks like this page is off the map.</h1><p>The page may have moved, or the address may be incorrect.</p><Link className="btn btn-primary" to="/dashboard">Back to dashboard</Link></div>}
