# PISL FieldOps Enterprise v39.1 Core + FCM

This GitHub-ready build keeps the existing Firebase project details unchanged in `js/firebase-config.js`.

## Active modules
- Dashboard
- Job assignment
- Realtime Firestore job updates
- Firebase Cloud Messaging device token registration
- In-app/browser notifications
- Customer Master
- Site Master
- Engineer Master view
- System-wise checklist templates
- Photo evidence with preview and compression
- Branded service report print/PDF
- WhatsApp report sharing
- Email report sharing
- Proposal / quotation reference
- Admin backup and notification cleanup

## Still excluded as requested
- Attendance
- GPS check-in/check-out
- QR asset scanning
- SLA timer
- Asset-wise service history

## FCM note
Firebase config is preserved. To enable real background push on a device, open Administration and paste the Firebase Web Push public VAPID key once, then click **Enable FCM Alerts**. The app stores the device token in Firestore collection `pushTokens`.

## Important production note
This build still uses demo username/password login with anonymous Firebase auth. Before full production deployment, replace this with Firebase Authentication and role-based Firestore security rules.
