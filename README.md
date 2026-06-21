# PISL FieldOps Enterprise v39.0 Core Scope

Active scope:
- User Management
- Role Management
- Job Assignment
- Realtime Job Updates
- In-app / browser notifications
- System-wise Checklists
- Service Reports
- File/Image Uploads
- Coordinator Dashboard
- Supervisor Dashboard
- Engineer Dashboard
- Offline Draft / Local Cache Support
- Firestore Sync
- WhatsApp Report Sharing
- Email Report Sharing
- Proposal / Quotation Reference

Removed from this core build as requested:
- Firebase Cloud Messaging background push scaffold
- Attendance Dashboard
- GPS Check-In / Check-Out
- QR Asset Scanning
- SLA Timer Engine
- Asset-wise Service History

Important production note:
Before live deployment, replace anonymous authentication and hardcoded demo passwords with Firebase Authentication and role-based Firestore security rules.


## Firebase config preserved
This build keeps the existing Firebase project settings unchanged in `js/firebase-config.js`. You can replace the GitHub repository files directly without manually editing Firebase settings.
