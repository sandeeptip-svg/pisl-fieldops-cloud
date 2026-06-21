# PISL FieldOps Enterprise v40.9 Firebase Health Dashboard Build

Rechecked and corrected build.

## Firebase / FCM
- Firebase project config applied for `pisl-field-ops`.
- Active Web Push VAPID public key applied.
- Minimal Notification Mode enabled by default.

## Minimal alerts enabled only for
- New Ticket Assigned
- Ticket Reassigned
- Escalation
- Customer Approved Report
- Ticket Closed

No push alerts for checklist edits, photo uploads, report drafts, auto-save, hold, or normal updates.

## Deployment
Upload all files to GitHub Pages. After deployment, hard refresh once or uninstall/reinstall the PWA to clear old service worker cache.


## v40.9 Update
- Added Admin → Firebase System Health panel.
- Admin can run live Firestore write/read connectivity test.
- Shows Firebase Config, Cloud Mode, Firestore SDK, Storage SDK, FCM SDK, Service Worker, Notification Permission and VAPID key status.
- Creates/updates `system_health/connectivity` automatically when the test is run.
