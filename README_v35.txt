PISL FieldOps Enterprise v35.0.0 Cloud Edition - Free Pilot

Host this folder on GitHub Pages.

Local login users:
- sandeep / admin123
- coordinator / coord123
- supervisor / super123
- engineer / eng123

For real-time multi-user testing:
1. Create Firebase free Spark project.
2. Enable Authentication > Anonymous provider.
3. Create Firestore database in test mode for pilot.
4. In Firebase project settings, copy Web App config JSON.
5. Login as sandeep, open Settings, paste Firebase config, Save & Connect.
6. Open the same GitHub Pages URL on different phones and log in with different users.

Note: Firestore security rules should be hardened before production. This build is for testing/pilot only.
