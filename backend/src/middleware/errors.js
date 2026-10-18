export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: 'Validation failed.', errors: Object.values(err.errors).map(e => e.message) });
  }
  if (err.code === 11000) return res.status(409).json({ success: false, message: 'A record with that unique value already exists.' });
  if (err.name === 'CastError') return res.status(400).json({ success: false, message: 'Invalid record ID.' });
  console.error(err);
  res.status(err.status || 500).json({ success: false, message: err.status ? err.message : 'Internal server error.' });
}
