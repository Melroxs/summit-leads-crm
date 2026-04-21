# Telnyx Realtime Calling And Coaching Plan

## Implemented in this repo

1. Tenant-scoped outbound session endpoint
2. Realtime voice payload builder
3. Whisper coaching injection endpoint
4. Telnyx webhook placeholders for events, streams, and recordings

## What still needs real provider execution

1. Create the actual Telnyx Call Control session request
2. Stand up a websocket or media processor for call audio
3. Stream audio to transcription and OpenAI reasoning
4. Convert coaching text to TTS
5. Inject that whisper audio only to the agent leg
6. Persist live transcript, summary, and QA outputs
