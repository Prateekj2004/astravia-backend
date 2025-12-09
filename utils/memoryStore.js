// Simple in-memory store: user identifier -> reports[]
// In real app: replace with MongoDB or SQL.

const userReports = new Map(); // key: identifier, value: array of reports

function saveReport(identifier, report) {
  if (!identifier) return;
  const list = userReports.get(identifier) || [];
  list.push({
    id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    report
  });
  userReports.set(identifier, list);
}

function getReports(identifier) {
  return userReports.get(identifier) || [];
}

module.exports = {
  saveReport,
  getReports
};
