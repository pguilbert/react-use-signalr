# react-use-signalr

## Getting Started
### 1. Install the hooks

```
npm install react-use-signalr --save
```

### 2. Install SignalR

If you haven't installed the signalR package yet, you have to add it manually:
```
npm install @microsoft/signalr --save
```

### 3. Setting up the HubConnection

```javascript
const signalRConnection = new HubConnectionBuilder()
  .withUrl("https://localhost:5001/chathub")
  .withAutomaticReconnect()
  .build();
```

### 4. Establish the connection
To start the SignalR connection, pass the HubConnection instance to the useHub hook. The hook will provide the current hub state as well as an error value if the connection fail.

```javascript
const { hubConnectionState, error } = useHub(signalRConnection);
```

### 5. Act on 
```javascript
useHubReceiver(hubConnection, "ReceiveMessage", (user, message) => {
    [...]
});
```

### 6. Invoke server method
```javascript
const { invoke, loading, error } = useHubSender(hubConnection, "SendMessage");

[...]

invoke([...]);
```