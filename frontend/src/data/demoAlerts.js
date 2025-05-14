export const demoAlerts = [
  {
    id: "demo-1",
    title: "Flash Flood Warning",
    alertType: 0, // Emergency
    description: "Heavy rainfall has caused flash flooding in low-lying areas. Avoid downtown and riverfront areas. Seek higher ground immediately if in affected zones.",
    location: "Chennai Central",
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    latitude: 13.083,
    longitude: 80.278,
    status: 0, // Active
    instructions: [
      "Move to higher ground immediately",
      "Avoid walking or driving through flood waters",
      "Stay away from power lines and electrical wires"
    ],
    additionalInfo: "Flood waters are expected to recede within 24-48 hours. Emergency services are deployed in affected areas."
  },
  {
    id: "demo-2",
    title: "Severe Weather Advisory",
    alertType: 1, // Warning
    description: "Strong winds and thunderstorms expected in the next 6-8 hours. Secure loose objects and avoid unnecessary travel.",
    location: "T.Nagar, Chennai",
    timestamp: Date.now() - 1000 * 60 * 120, // 2 hours ago
    latitude: 13.040,
    longitude: 80.229,
    status: 0, // Active
    instructions: [
      "Secure outdoor furniture and objects",
      "Avoid unnecessary travel",
      "Keep emergency supplies ready"
    ]
  },
  {
    id: "demo-3",
    title: "Road Closure",
    alertType: 2, // Information
    description: "Anna Salai is closed due to construction. Expected to reopen tomorrow morning. Use alternative routes.",
    location: "Anna Salai, Chennai",
    timestamp: Date.now() - 1000 * 60 * 60 * 12, // 12 hours ago
    latitude: 13.059,
    longitude: 80.261,
    status: 0, // Active
    instructions: [
      "Use alternative routes",
      "Expect delays in surrounding areas",
      "Follow traffic police directions"
    ]
  },
  {
    id: "demo-4", 
    title: "Evacuation Order Lifted",
    alertType: 3, // Safe
    description: "The evacuation order for North Chennai has been lifted. Residents may return to their homes.",
    location: "North Chennai",
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 24 hours ago
    latitude: 13.117, 
    longitude: 80.292,
    status: 1, // Resolved
    instructions: [
      "Return to homes is now permitted",
      "Report any damage to municipal authorities",
      "Continue to monitor official communications"
    ]
  }
];