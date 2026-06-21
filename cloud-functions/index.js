const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const ALLOWED_MINIMAL = new Set([
  'new_ticket_assigned', 'ticket_assigned', 'ticket_reassigned',
  'escalation', 'escalated', 'customer_approved_report',
  'customer_approved', 'ticket_closed', 'closed'
]);

exports.sendMinimalFieldOpsAlert = functions.firestore
  .document('notification_outbox/{id}')
  .onCreate(async (snap) => {
    const n = snap.data() || {};
    if (!ALLOWED_MINIMAL.has(n.type)) {
      await snap.ref.set({ status: 'skipped', reason: 'not-minimal-alert', processedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
      return null;
    }
    const toIds = Array.isArray(n.toIds) ? n.toIds.filter(Boolean) : [];
    if (!toIds.length) {
      await snap.ref.set({ status: 'skipped', reason: 'no-target-users', processedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
      return null;
    }
    const tokenSnaps = await Promise.all(toIds.map(uid => admin.firestore().collection('pushTokens').where('userId', '==', uid).get()));
    const tokens = [...new Set(tokenSnaps.flatMap(q => q.docs.map(d => d.data().token).filter(Boolean)))];
    if (!tokens.length) {
      await snap.ref.set({ status: 'skipped', reason: 'no-registered-tokens', processedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
      return null;
    }
    const message = {
      tokens,
      notification: {
        title: n.title || 'PISL FieldOps',
        body: n.message || 'Important FieldOps update'
      },
      data: {
        type: String(n.type || ''),
        ticketId: String(n.ticketId || ''),
        ticketNo: String(n.ticketId || '')
      },
      webpush: {
        fcmOptions: { link: n.ticketId ? `/?ticket=${encodeURIComponent(n.ticketId)}` : '/' },
        notification: {
          icon: '/assets/logo.png',
          badge: '/assets/logo.png',
          tag: n.ticketId || n.type || 'pisl-fieldops'
        }
      }
    };
    const res = await admin.messaging().sendEachForMulticast(message);
    await snap.ref.set({
      status: 'sent',
      successCount: res.successCount,
      failureCount: res.failureCount,
      processedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    return null;
  });
