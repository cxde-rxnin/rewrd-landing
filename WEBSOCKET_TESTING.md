# WebSocket Testing Guide with Postman

## Prerequisites
- Postman Desktop App (WebSocket support requires desktop version)
- Valid access token from your API

## Step 1: Get Your Access Token

### Option A: From Browser DevTools
1. Log in to your application
2. Open Browser DevTools (F12)
3. Go to Console tab
4. Look for the debug log: `apiFetch: token = <your_token>`
5. Copy the token value

### Option B: From Login API
1. In Postman, create a POST request to:
   ```
   POST https://api.partnerpulse.us/api/auth/login
   ```

2. Set Headers:
   ```
   Content-Type: application/json
   ```

3. Set Body (raw JSON):
   ```json
   {
     "email": "your.email@example.com",
     "password": "yourpassword"
   }
   ```

4. Send the request
5. Copy the `access_token` from the response

## Step 2: Connect to WebSocket in Postman

1. **Create New WebSocket Request**
   - Click "New" → "WebSocket Request"
   - Or click the "+" tab and select WebSocket

2. **Enter WebSocket URL**
   ```
   wss://api.partnerpulse.us/ws?token=YOUR_ACCESS_TOKEN_HERE
   ```
   
   Replace `YOUR_ACCESS_TOKEN_HERE` with your actual token from Step 1

3. **Connect**
   - Click the "Connect" button
   - If successful, you'll see "Connected" status in green
   - The message log will show connection established

## Step 3: Monitor Real-Time Messages

Once connected, Postman will display all incoming messages from the server.

### Expected Message Format
```json
{
  "type": "task_created",
  "task_id": "123",
  "data": {
    "title": "New Task",
    "reward": 100
  }
}
```

## Step 4: Send Test Messages (Optional)

If your backend supports client-to-server messages:

1. In the "New message" section at the bottom
2. Select "JSON" format
3. Enter your message:
   ```json
   {
     "type": "ping"
   }
   ```
4. Click "Send"

## Step 5: Test Different Event Types

### Simulate Events by Triggering Actions

To test real-time updates, you need to trigger events:

#### Test Task Creation
1. Keep WebSocket connected in Postman
2. In another Postman tab, create a task:
   ```
   POST https://api.partnerpulse.us/api/task
   Authorization: Bearer YOUR_ACCESS_TOKEN
   
   {
     "title": "Test Task",
     "description": "Testing WebSocket",
     "count": 1,
     "reward": 50,
     "expires_at": "2026-01-31T23:59:59Z",
     "url": "https://example.com",
     "task_type_id": "some-type-id"
   }
   ```
3. Watch the WebSocket tab for a `task_created` event

#### Test Task Update
1. Update a task via API:
   ```
   PATCH https://api.partnerpulse.us/api/task/{task_id}
   Authorization: Bearer YOUR_ACCESS_TOKEN
   
   {
     "title": "Updated Task"
   }
   ```
2. Watch for `task_updated` event

#### Test Submission
1. Submit a task via API:
   ```
   POST https://api.partnerpulse.us/api/task/{task_id}/submission?action=submit
   Authorization: Bearer YOUR_ACCESS_TOKEN
   ```
2. Watch for `submission_created` or `task_submitted` event

## Troubleshooting

### Connection Failed (401 Unauthorized)
**Problem**: WebSocket connection gets 401 error

**Solutions**:
- ✅ Verify your token is valid (not expired)
- ✅ Make sure token is included in URL: `?token=YOUR_TOKEN`
- ✅ Check token doesn't have extra quotes or spaces
- ✅ Try getting a fresh token from login endpoint

### Connection Immediately Closes
**Problem**: Connection establishes but closes right away

**Solutions**:
- ✅ Check backend server logs for errors
- ✅ Verify WebSocket server is running
- ✅ Check if there's a token validation issue
- ✅ Ensure you're using `wss://` (secure) for HTTPS backends

### No Messages Received
**Problem**: Connected but not receiving any messages

**Solutions**:
- ✅ Trigger some events (create/update tasks)
- ✅ Check if backend is configured to send messages to your user
- ✅ Verify message format matches expected format
- ✅ Check backend WebSocket implementation

### Connection Timeout
**Problem**: Connection times out

**Solutions**:
- ✅ Check your internet connection
- ✅ Verify the WebSocket URL is correct
- ✅ Check firewall/proxy settings
- ✅ Try from different network

## Testing Scenarios

### Scenario 1: Brand Creates Task
**Expected Flow**:
1. Brand connects to WebSocket
2. Brand creates a task via API
3. All participants receive `task_created` event
4. Participants' task lists update automatically

**Postman Setup**:
- Tab 1: WebSocket connection (as participant user)
- Tab 2: POST create task (as brand user)
- Watch Tab 1 for incoming message

### Scenario 2: Participant Submits Task
**Expected Flow**:
1. Participant submits task via API
2. Brand receives `submission_created` event
3. Brand's pending submissions count updates

**Postman Setup**:
- Tab 1: WebSocket connection (as brand user)
- Tab 2: POST submit task (as participant user)
- Watch Tab 1 for incoming message

### Scenario 3: Brand Reviews Submission
**Expected Flow**:
1. Brand approves/rejects submission via API
2. Participant receives `submission_approved` or `submission_rejected` event
3. Participant sees updated task status

**Postman Setup**:
- Tab 1: WebSocket connection (as participant user)
- Tab 2: PATCH review submission (as brand user)
- Watch Tab 1 for incoming message

## Tips for Effective Testing

### 1. Use Multiple WebSocket Tabs
Open multiple WebSocket connections with different user tokens to simulate:
- Brand monitoring their tasks
- Participants monitoring available tasks
- Real-time interaction between users

### 2. Save as Collection
Save your WebSocket requests and API calls in a Postman collection for easy reuse:
```
My App Collection/
├── Authentication/
│   └── Login
├── WebSocket/
│   ├── Connect as Brand
│   ├── Connect as Participant
│   └── Connect as Influencer
└── Tasks/
    ├── Create Task
    ├── Update Task
    ├── Submit Task
    └── Review Submission
```

### 3. Use Environment Variables
Create a Postman environment with:
- `base_url`: `https://api.partnerpulse.us`
- `ws_url`: `wss://api.partnerpulse.us/ws`
- `access_token`: (set after login)
- `task_id`: (set after creating task)

Then use: `{{ws_url}}?token={{access_token}}`

### 4. Monitor Console Logs
Check the Postman console (View → Show Postman Console) for:
- Raw WebSocket frames
- Connection details
- Error messages

## Example Test Workflow

```
1. Login (Get Token)
   POST /api/auth/login
   → Save access_token

2. Connect WebSocket
   wss://api.partnerpulse.us/ws?token={{access_token}}
   → Status: Connected

3. Create Task (in another tab)
   POST /api/task
   → Check WebSocket tab for event

4. Verify Event Received
   {
     "type": "task_created",
     "task_id": "new-task-id",
     "data": { ... }
   }

5. Update Task
   PATCH /api/task/new-task-id
   → Check WebSocket for task_updated event

6. Delete Task
   DELETE /api/task/new-task-id
   → Check WebSocket for task_deleted event
```

## Backend WebSocket Message Examples

### Task Created
```json
{
  "type": "task_created",
  "task_id": "task_123",
  "data": {
    "title": "Follow on Instagram",
    "reward": 50,
    "creator": "Brand XYZ"
  }
}
```

### Task Started
```json
{
  "type": "task_started",
  "task_id": "task_123",
  "user_id": "user_456",
  "data": {
    "participant_name": "John Doe",
    "started_at": "2026-01-05T12:00:00Z"
  }
}
```

### Submission Created
```json
{
  "type": "submission_created",
  "task_id": "task_123",
  "user_id": "user_456",
  "data": {
    "submission_url": "https://instagram.com/p/xyz",
    "submitted_at": "2026-01-05T13:00:00Z"
  }
}
```

### Submission Approved
```json
{
  "type": "submission_approved",
  "task_id": "task_123",
  "user_id": "user_456",
  "data": {
    "reward_amount": 50,
    "approved_at": "2026-01-05T14:00:00Z"
  }
}
```

## Automation Testing

You can also use Postman's Collection Runner with pre-request scripts to automate WebSocket testing:

```javascript
// Pre-request Script
pm.sendRequest({
    url: pm.environment.get("base_url") + "/api/auth/login",
    method: 'POST',
    header: {
        'Content-Type': 'application/json'
    },
    body: {
        mode: 'raw',
        raw: JSON.stringify({
            email: "test@example.com",
            password: "password123"
        })
    }
}, function (err, res) {
    pm.environment.set("access_token", res.json().access_token);
});
```

## Next Steps

After verifying WebSocket works in Postman:
1. Test in your actual application
2. Check browser DevTools Network tab (WS filter)
3. Monitor WebSocket connection status indicator
4. Verify toast notifications appear
5. Confirm task list updates automatically
