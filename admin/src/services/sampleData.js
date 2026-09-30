// services/sampleData.js — fallback data so the admin app is demonstrable
// before real reports exist in Firestore. Mirrors the shape of documents
// stored by the user app in the 'incidents' collection.

export const sampleReports = [
  {
    id: 'sample-1001',
    title: 'Bags dumped near riverbank',
    wasteType: 'Household waste',
    description: 'Multiple garbage bags piled beside the river.',
    location: { lat: 14.6042, lng: 121.0489 },
    evidenceImages: [
      'https://codesujen.com/api/placeholder/640/400?text=riverbank+waste',
      'https://codesujen.com/api/placeholder/640/400?text=evidence+2',
    ],
    status: 'pending',
    reporterName: 'Maria Santos',
    reportedBy: 'sample-user-1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: 'sample-1002',
    title: 'Construction debris on vacant lot',
    wasteType: 'Construction debris',
    description: 'Construction rubble dumped on an empty lot.',
    location: { lat: 14.5998, lng: 121.051 },
    evidenceImages: [],
    status: 'resolved',
    reporterName: 'John Cruz',
    reportedBy: 'sample-user-2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26),
  },
  {
    id: 'sample-1003',
    title: 'Electronics left on sidewalk',
    wasteType: 'E-waste',
    description: 'Old appliances abandoned on the sidewalk.',
    location: { lat: 14.6125, lng: 121.0417 },
    evidenceImages: [],
    status: 'rejected',
    reporterName: 'Ana Reyes',
    reportedBy: 'sample-user-3',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50),
  },
]