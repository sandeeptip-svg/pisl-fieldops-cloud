# PISL FieldOps Enterprise v41.0
## Connectivity + Minimal Push + Detailed Checklist Build

This build addresses:
- Login/session retained after browser refresh.
- FCM token registration corrected to use the main `service-worker.js` instead of conflicting service workers.
- Push setup now shows clear success/failure reason in Administration.
- Minimal push alert events only.
- `notification_outbox` added for backend push delivery.
- Firebase Cloud Function included under `cloud-functions/` for real FCM delivery.
- Point-to-point detailed checklist library added for Comprehensive AMC, Non-Comprehensive AMC, PM, service, breakdown, installation, survey/audit and other jobs.

## Important Push Notification Note
A static GitHub Pages web app can register the device token, but it cannot securely send FCM push messages by itself. Deploy the included Cloud Function once to send pushes from Firestore `notification_outbox`.

### Deploy Push Delivery Function
```bash
cd cloud-functions
npm install
firebase init functions
firebase deploy --only functions
```

Use Firebase project: `pisl-fieldops-cloud-34513`.

## Minimal Alerts Sent
- New Ticket Assigned
- Ticket Reassigned
- Escalation
- Customer Approved Report
- Ticket Closed

No push alerts are sent for checklist edit, photo upload, auto-save, report draft, or normal updates.

## Browser Requirement
Push notification token generation works only on HTTPS, such as GitHub Pages. It will not work from `file://` local opening.
