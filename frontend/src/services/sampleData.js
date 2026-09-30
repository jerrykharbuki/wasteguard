// Sample/mock incident data so the admin section is demonstrable before
// the Firebase database is populated. These follow the same shape the
// Firestore documents use (see firestoreService.js / ReportForm).
// In development, AdminReports falls back to these when Firestore has none.

export const sampleReports = [
  {
    id: 'SMP-1001',
    wasteType: 'Household waste',
    title: 'Bags dumped near riverbank',
    description: 'Multiple garbage bags piled beside the river.',
    location: { lat: 14.6042, lng: 121.0489 },
    evidenceImages: [
      'https://codesujen.com/api/placeholder/640/400?text=riverbank+waste',
    ],
    status: 'pending',
    reportedBy: 'sample-user-1',
    reporterName: 'Maria Santos',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5h ago
  },
  {
    id: 'SMP-1002',
    wasteType: 'Construction debris',
    title: 'Debris on vacant lot',
    description: 'Construction rubble dumped on an empty lot.',
    location: { lat: 14.5998, lng: 121.0510 },
    evidenceImages: [],
    status: 'resolved',
    reportedBy: 'sample-user-2',
    reporterName: 'John Cruz',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26), // 26h ago
  },
  {
    id: 'SMP-1003',
    wasteType: 'E-waste',
    title: 'Electronics left on sidewalk',
    description: 'Old appliances abandoned on the sidewalk.',
    location: { lat: 14.6125, lng: 121.0417 },
    evidenceImages: [],
    status: 'rejected',
    reportedBy: 'sample-user-3',
    reporterName: 'Ana Reyes',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50), // 50h ago
  },
]