# PISL FieldOps Enterprise v40.8 FCM Minimal Alerts Build

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
