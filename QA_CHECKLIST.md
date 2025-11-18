QA Checklist for Learning & Tutoring module

1. Authentication
   - [ ] Login as tutor, student, and parent.
   - [ ] Confirm role-based access: tutor can start session and upload resources; student can view resources and use assistant.

2. Assignment Assistant
   - [ ] Navigate to /learning/assistant when logged in.
   - [ ] Ask a question and confirm assistant returns steps and hints.
   - [ ] Verify rate limiting by sending many requests quickly and confirming a 429 occurs when exceeded.

3. Resources
   - [ ] Upload a PDF as a tutor via UploadResource.
   - [ ] Confirm it appears in ResourcesHub.
   - [ ] Open/download resource (fileUrl should serve static file).
   - [ ] Trigger summarize (POST /api/learning/resources/:id/summarize) and confirm summary stored.

4. Sessions
   - [ ] Tutor starts a session (StartSession) and receives a session ID.
   - [ ] Student/parent can join by session ID (JoinSession) — placeholder alert appears.
   - [ ] Upload a recording (POST /api/sessions/upload) and confirm it appears under RecordedSessions.

5. Accessibility & UX
   - [ ] Tab through interactive elements (inputs, buttons) and ensure keyboard focus.
   - [ ] ARIA attributes present on important interactive elements.

6. Error handling
   - [ ] Remove auth token and confirm ProtectedRoute redirects to login.
   - [ ] Try uploading a >50MB file and confirm a sensible error message.

Notes:
- Some features are stubbed (LLM, WebRTC signaling). See README for production swap instructions.
