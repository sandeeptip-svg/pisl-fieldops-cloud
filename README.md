# PISL FieldOps Enterprise v39.3 Core + FCM Stable

Ready-to-upload GitHub Pages PWA build.

## Included
- Core dashboard
- Job creation and lifecycle
- Default system-wise checklist library
- Job-specific checklist generation for Service Call / PM Visit
- Photo upload preview and report attachment
- Branded service report print/PDF
- Proposal / quotation preview and print/PDF
- Customer, site, engineer and checklist masters
- Firestore realtime sync
- FCM token registration

## FCM Note
The VAPID key input has been removed from the application screen. Set it once in `js/firebase-config.js` as `FCM_PUBLIC_VAPID_KEY`. This is the Firebase Web Push public key, not a private server key.

## Excluded
Attendance, GPS, QR, SLA and Asset History are intentionally excluded from this core build.
