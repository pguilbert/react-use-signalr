# react-use-signalr

![Node.js CI](https://github.com/pguilbert/react-use-signalr/workflows/Node.js%20CI/badge.svg)

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
Use the HubConnectionBuilder descibed in the [Microsoft documentation](https://docs.microsoft.com/en-us/aspnet/core/signalr/javascript-client) to build the connection.

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

### 5. Call client methods from the hub
```javascript
useClientMethod(signalRConnection, "ReceiveMessage", (user, message) => {
    [...]
});
```

### 6. Call hub methods from the client
```javascript
const { invoke, loading, error } = useHubMethod(signalRConnection, "SendMessage");

[...]

invoke([...]);
```