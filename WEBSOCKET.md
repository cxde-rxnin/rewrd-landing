# WebSocket Integration for Real-Time Task Updates

## Overview
The application now includes WebSocket support for real-time task updates. This allows users to receive instant notifications when tasks are created, updated, or when their submissions are reviewed.

## Configuration

### Environment Variables
Add to your `.env` file:
```env
VITE_API_BASE_URL=https://api.partnerpulse.us
VITE_WS_URL=wss://api.partnerpulse.us/ws
```

## WebSocket Service (`src/services/websocket.ts`)

### Features
- **Automatic Connection**: Connects when user logs in with access token
- **Auto-Reconnect**: Attempts to reconnect up to 5 times if connection drops
- **Token Authentication**: Sends access token as query parameter
- **Event Handlers**: Support for message, error, and close events

### Usage
```typescript
import { wsService } from '@/services/websocket';

// Connect with access token
wsService.connect(accessToken);

// Subscribe to messages
const unsubscribe = wsService.onMessage((data) => {
  console.log('Received:', data);
});

// Send message
wsService.send({ type: 'ping' });

// Check connection status
const connected = wsService.isConnected();

// Disconnect
wsService.disconnect();

// Cleanup
unsubscribe();
```

## React Hook (`src/hooks/useWebSocket.ts`)

### Usage in Components
```typescript
import { useWebSocket } from '@/hooks/useWebSocket';
import { useAuth } from '@/hooks/api/useAuth';

function MyComponent() {
  const { accessToken } = useAuth();
  const { isConnected, subscribe, sendMessage } = useWebSocket(accessToken);

  useEffect(() => {
    const unsubscribe = subscribe((data) => {
      // Handle real-time updates
      console.log('Update:', data);
    });

    return unsubscribe;
  }, [subscribe]);

  return (
    <div>
      Status: {isConnected ? 'Connected' : 'Disconnected'}
    </div>
  );
}
```

## Tasks Page Integration

The Tasks page (`src/pages/Tasks.tsx`) is integrated with WebSocket for real-time updates.

### Supported Events
The following WebSocket event types are handled:

**New Format (Recommended):**
1. **task:created**: New task is available
2. **task:updated**: Existing task has been modified
3. **task:deleted**: A task has been removed
4. **task:started**: A participant has started a task
5. **task:status_changed**: Task status has changed
6. **submission:created**: A participant has submitted their work
7. **submission:updated**: Submission status has been updated (pending, approved, rejected)
8. **submission:reviewed**: A task submission has been reviewed
9. **submission:approved**: A task submission has been approved
10. **submission:rejected**: A task submission has been rejected
11. **task:completed**: A task has been completed

**Legacy Format (Still Supported):**
- task_created, task_updated, task_deleted, task_started, task_claimed, task_status_changed
- submission_created, task_submitted, submission_reviewed, submission_approved, submission_rejected, task_completed

### Expected WebSocket Message Format

**New Format (Recommended):**
```json
{
  "event": "task:created" | "task:updated" | "task:deleted" | "task:started" | "task:status_changed" | "submission:created" | "submission:updated" | "submission:reviewed" | "submission:approved" | "submission:rejected" | "task:completed",
  "data": {
    "id": "string (submission/task id)",
    "task_id": "string",
    "user_id": "string",
    "status": "string (pending, approved, rejected, in_progress, completed)",
    "created_at": "ISO timestamp",
    "updated_at": "ISO timestamp",
    "verified_at": "ISO timestamp (optional)",
    "proof_url": "string (optional)",
    "earned": "number (optional)",
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "account_type": "brand" | "influencer" | "participant"
    }
  }
}
```

**Legacy Format (Deprecated but supported):**
```json
{
  "type": "task_created" | "task_updated" | ... (underscore format),
  "task_id": "string",
  "user_id": "string",
  "status": "string",
  "data": { /* additional data */ }
}
```

### Visual Indicator
The Tasks page displays a live connection status indicator:
- 🟢 **Green dot**: Connected and receiving updates
- 🔴 **Red dot**: Disconnected (offline mode)

## Backend Requirements

### WebSocket Endpoint
- **URL**: `wss://api.partnerpulse.us/ws`
- **Authentication**: Token passed as query parameter: `?token=<access_token>`

### Expected Message Format (from server)
```json
{
  "type": "task_created" | "task_updated" | "task_deleted" | "task_started" | "task_claimed" | "task_status_changed" | "submission_created" | "task_submitted" | "submission_reviewed" | "submission_approved" | "submission_rejected" | "task_completed",
  "task_id": "string",
  "user_id": "string" (optional, for task_started/submission events),
  "status": "string" (optional, for task_status_changed),
  "data": { /* additional task/submission data */ }
}
```

### Event Flow Examples

**Participant Claims a Task:**
```json
{
  "type": "task_started",
  "task_id": "task_123",
  "user_id": "user_456",
  "data": {
    "participant_name": "John Doe"
  }
}
```

**Participant Submits Work:**
```json
{
  "type": "submission_created",
  "task_id": "task_123",
  "user_id": "user_456",
  "data": {
    "submission_url": "https://...",
    "submitted_at": "2026-01-05T12:00:00Z"
  }
}
```

**Brand Reviews Submission (New Format):**
```json
{
  "event": "submission:updated",
  "data": {
    "id": "0225d2b6-0317-4f32-8c00-52a30373af85",
    "task_id": "f29cd9c2-18e0-4ec3-93da-6bd23dc9108a",
    "user_id": "10fb2167-3bba-48d6-bb2f-0048470ee1de",
    "status": "approved",
    "created_at": "2026-01-08T16:32:04.420671Z",
    "updated_at": "2026-01-08T16:35:00.000000Z",
    "verified_at": "2026-01-08T16:35:00.000000Z",
    "proof_url": "https://...",
    "earned": 50.00,
    "user": {
      "id": "10fb2167-3bba-48d6-bb2f-0048470ee1de",
      "name": "Brad Pitt",
      "email": "brad@gmail.com",
      "account_type": "participant"
    }
  }
}
```

**Brand Reviews Submission (Legacy Format):**
```json
{
  "type": "submission_approved",
  "task_id": "task_123",
  "user_id": "user_456",
  "data": {
    "reviewer": "brand_789",
    "reviewed_at": "2026-01-05T13:00:00Z"
  }
}
```

### Connection Flow
1. Client connects with token: `wss://api.partnerpulse.us/ws?token=<access_token>`
2. Server validates token
3. Server sends real-time updates for relevant tasks
4. Client auto-reconnects if connection drops

## Testing

### Manual Testing
1. Open browser DevTools Console
2. Navigate to Tasks page
3. Check for WebSocket connection logs
4. Trigger task events from another browser/user
5. Verify real-time updates appear

### Debug Logs
The service logs important events:
- Connection attempts
- Connection success
- Messages received
- Errors
- Reconnection attempts

### Postman Testing
Use Postman's WebSocket feature:
1. Create new WebSocket request
2. URL: `wss://api.partnerpulse.us/ws?token=YOUR_TOKEN`
3. Connect and monitor messages

## Troubleshooting

### Connection Issues
- Verify `VITE_WS_URL` environment variable
- Check browser console for errors
- Ensure access token is valid
- Check backend WebSocket server is running

### No Real-Time Updates
- Check WebSocket connection status indicator (should be green)
- Verify backend is sending correct message format
- Check browser console for message logs

### Frequent Disconnections
- Check network stability
- Verify backend WebSocket timeout settings
- Review reconnection attempt logs

## Future Enhancements
- Send typing indicators for task comments
- Real-time task claim/unclaim notifications
- Live participant count for tasks
- WebSocket heartbeat/ping-pong for connection health
