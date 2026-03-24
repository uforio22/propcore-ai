// ===== PropCore AI — Mock Contractors Data =====

// Performance score calculation: composite of tenant rating (30%), response time (20%), completion rate (20%), re-visit rate (15%), reliability (15%)
function calcPerformanceScore(c) {
  const ratingScore = (c.rating / 5) * 30;
  const responseScore = Math.max(0, (1 - c.avgResponseHrs / 48)) * 20;
  const completionScore = (c.completionRate / 100) * 20;
  const revisitScore = Math.max(0, (1 - c.revisitRate / 20)) * 15;
  const reliabilityScore = (c.reliabilityRate / 100) * 15;
  return Math.round(ratingScore + responseScore + completionScore + revisitScore + reliabilityScore);
}

const CONTRACTORS = [
  { id: 'C001', name: 'Dave Plumbing Services', contact: 'Dave Harrison', email: 'dave@daveplumbing.co.uk', phone: '07800 112233', trades: ['Plumbing', 'Heating'], serviceAreas: ['BS1', 'BS2', 'BS6', 'BS7', 'BS8'], rating: 4.8, jobsCompleted: 47, avgResponseHrs: 3, dayRate: 280, compliance: { gasSafe: { number: 'GS-554231', expiry: '2026-11-15' }, publicLiability: { expiry: '2026-09-01' } }, status: 'Active', revisitRate: 4, completionRate: 96, reliabilityRate: 98, totalAssigned: 49, onTimeRate: 94, feedbackCount: 42 },
  { id: 'C002', name: 'QuickFix Appliances', contact: 'Mark Ellis', email: 'info@quickfixappliances.com', phone: '07911 445566', trades: ['Appliance'], serviceAreas: ['BS1', 'BS2', 'BS3', 'BS4', 'BS5', 'BS6', 'BS7', 'BS8'], rating: 4.5, jobsCompleted: 31, avgResponseHrs: 8, dayRate: 220, compliance: { publicLiability: { expiry: '2026-07-20' } }, status: 'Active', revisitRate: 6, completionRate: 94, reliabilityRate: 90, totalAssigned: 33, onTimeRate: 88, feedbackCount: 27 },
  { id: 'C003', name: 'Bristol Lock & Key', contact: 'Steve Lockwood', email: 'steve@bristollockkey.co.uk', phone: '07722 334455', trades: ['General Repairs', 'Locksmith'], serviceAreas: ['BS1', 'BS2', 'BS6', 'BS7', 'BS8'], rating: 4.9, jobsCompleted: 62, avgResponseHrs: 2, dayRate: 200, compliance: { publicLiability: { expiry: '2027-01-10' } }, status: 'Active', revisitRate: 2, completionRate: 98, reliabilityRate: 100, totalAssigned: 63, onTimeRate: 97, feedbackCount: 58 },
  { id: 'C004', name: 'Apex Roofing Bristol', contact: 'Phil Torres', email: 'phil@apexroofing.co.uk', phone: '07833 556677', trades: ['Roofing', 'Guttering'], serviceAreas: ['BS1', 'BS2', 'BS3', 'BS6', 'BS7', 'BS8', 'BS9'], rating: 4.6, jobsCompleted: 18, avgResponseHrs: 24, dayRate: 350, compliance: { publicLiability: { expiry: '2026-12-01' } }, status: 'Active', revisitRate: 5, completionRate: 90, reliabilityRate: 85, totalAssigned: 20, onTimeRate: 80, feedbackCount: 15 },
  { id: 'C005', name: 'Spark Electrical Solutions', contact: 'Karen Wright', email: 'karen@sparkelectrical.co.uk', phone: '07944 667788', trades: ['Electrical'], serviceAreas: ['BS1', 'BS2', 'BS6', 'BS7', 'BS8'], rating: 4.7, jobsCompleted: 39, avgResponseHrs: 5, dayRate: 300, compliance: { electricalCert: { number: 'EC-881234', expiry: '2026-08-30' }, publicLiability: { expiry: '2026-10-15' } }, status: 'Active', revisitRate: 3, completionRate: 97, reliabilityRate: 95, totalAssigned: 40, onTimeRate: 93, feedbackCount: 35 },
  { id: 'C006', name: 'ClearPest Solutions', contact: 'Ian Morris', email: 'ian@clearpest.co.uk', phone: '07655 778899', trades: ['Pest Control'], serviceAreas: ['BS1', 'BS2', 'BS3', 'BS4', 'BS5', 'BS6', 'BS7', 'BS8', 'BS9'], rating: 4.4, jobsCompleted: 22, avgResponseHrs: 12, dayRate: 180, compliance: { publicLiability: { expiry: '2026-04-15' } }, status: 'Active', revisitRate: 8, completionRate: 88, reliabilityRate: 82, totalAssigned: 25, onTimeRate: 76, feedbackCount: 18 },
  { id: 'C007', name: 'West Country Decorators', contact: 'Sam Briggs', email: 'sam@wcdecorators.co.uk', phone: '07566 889900', trades: ['General Repairs', 'Painting', 'Decorating'], serviceAreas: ['BS1', 'BS6', 'BS7', 'BS8'], rating: 4.3, jobsCompleted: 15, avgResponseHrs: 48, dayRate: 240, compliance: { publicLiability: { expiry: '2026-02-28' } }, status: 'Expired Docs', revisitRate: 7, completionRate: 83, reliabilityRate: 70, totalAssigned: 18, onTimeRate: 72, feedbackCount: 12 },
  { id: 'C008', name: 'Bristol Gas Engineers', contact: 'Tony Clark', email: 'tony@bristolgas.co.uk', phone: '07477 990011', trades: ['Plumbing', 'Heating', 'Gas'], serviceAreas: ['BS1', 'BS2', 'BS3', 'BS6', 'BS7', 'BS8'], rating: 4.6, jobsCompleted: 28, avgResponseHrs: 4, dayRate: 310, compliance: { gasSafe: { number: 'GS-667890', expiry: '2027-03-01' }, publicLiability: { expiry: '2026-11-30' } }, status: 'Active', revisitRate: 5, completionRate: 93, reliabilityRate: 92, totalAssigned: 30, onTimeRate: 90, feedbackCount: 25 },
];

// Pre-compute performance scores
CONTRACTORS.forEach(c => { c.performanceScore = calcPerformanceScore(c); });

// Sort by performance for ranking
const CONTRACTOR_RANKINGS = [...CONTRACTORS].sort((a, b) => b.performanceScore - a.performanceScore).map((c, i) => ({ ...c, rank: i + 1 }));
