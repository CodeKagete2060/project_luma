# Learning & Tutoring Module

This document describes how to run the Learning & Tutoring module locally, environment variables, and how to swap in production services (LLM, storage, video).

## Env variables (server/.env)
- MONGO_URI - MongoDB connection URI
- JWTSECRET - JWT secret used by auth
- LLM_PROVIDER - 'mock' (default) or 'openai' / 'azure' etc.
- LLM_RATE_LIMIT - numeric rate limit per minute per user (default 30)
- STORAGE_PATH - optional path where uploads will be stored (default: server/uploads)

Optional for third-party video providers (not required for local):
- TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_API_KEY
- DAILY_API_KEY or DAILY_PROJECT

## Local first-run
1. From `server/` install dependencies:

```powershell
cd server
npm install
npm run dev
```

2. From `client/` start Vite:

```powershell
cd client
npm install
npm run dev
```

3. Open the app at the address Vite prints (e.g., http://localhost:5174).

## Notes on stubs and production swaps
- LLM: `server/utils/llm.js` currently uses a `mock` provider. To swap to OpenAI:
  - Set `LLM_PROVIDER=openai` and implement an adapter in `utils/llm.js` to call the OpenAI API with your API key.
- Storage: uploaded files are saved under `server/uploads/...`. For production:
  - Use S3 or Cloudinary. Replace `middleware/uploadMiddleware.js` with an S3 upload flow (use aws-sdk or @aws-sdk/client-s3). Keep the same endpoints and return `fileUrl` as a signed S3 URL.
- Video: the repo contains small WebRTC placeholders. For reliability in production, consider Daily or Twilio. See `LEARNING_README.md` for example integration steps.

## Tests
- Server tests use Jest. From `server/` run:

```powershell
npm test
```

The tests currently validate the LLM mock and rate-limiter.

## QA checklist
See `QA_CHECKLIST.md` for a short manual test checklist.
