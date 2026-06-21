# PISL FieldOps Push Delivery Function

The PWA can register the browser/device token, but a static GitHub Pages app cannot securely send FCM pushes by itself. Deploy this Firebase Cloud Function once to deliver minimal alerts from `notification_outbox`.

Deploy:

```bash
cd cloud-functions
npm install
firebase init functions
# choose existing project: pisl-fieldops-cloud-34513
# keep this index.js, or copy it into the generated functions folder
firebase deploy --only functions
```

Only these alert types are sent:
- new_ticket_assigned / ticket_assigned
- ticket_reassigned
- escalation / escalated
- customer_approved_report / customer_approved
- ticket_closed / closed
