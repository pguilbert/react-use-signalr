import { HubConnection, HubConnectionState } from "@microsoft/signalr";
import { useEffect, useState } from "react";

/**
 * Start/Stop the provided hub connection (on connection change or when the component is unmounted)
 * @param {HubConnection} hubConnection The signalR hub connection
 * @return {HubConnection} the current signalr connection
 * @return {any} the signalR error in case the start does not work
 */
export function useHub(hubConnection?: HubConnection) {
    const [hubConnectionState, setHubConnectionState] = useState<HubConnectionState>(hubConnection?.state ?? HubConnectionState.Disconnected);
    const [error, setError] = useState();

    useEffect(() => {
        setError(undefined);

        if (!hubConnection) {
            setHubConnectionState(HubConnectionState.Disconnected);
            return;
        }

        if(hubConnection.state !== hubConnectionState) {
            setHubConnectionState(hubConnection.state);
        }

        let isMounted = true;
        const onStateUpdatedCallback = () => {
            if(isMounted) {
                setHubConnectionState(hubConnection?.state);
            }
        }

        const onConnectErrorCallback = (error?: Error | undefined) => {
            onStateUpdatedCallback();
            setError(error?.message);
        }

        hubConnection.onclose(onConnectErrorCallback);
        hubConnection.onreconnected(onStateUpdatedCallback);
        hubConnection.onreconnecting(onConnectErrorCallback);

        if (hubConnection.state === HubConnectionState.Disconnected) {
            const startPromise = hubConnection
                .start()
                .then(onStateUpdatedCallback)
                .catch(reason => setError(reason));
            onStateUpdatedCallback();

            return () => {
                startPromise.then(() => {
                    hubConnection.stop();
                });
                isMounted = false;
            };
        }

        return () => {
            hubConnection.stop();
        };
    }, [hubConnection]);

    return { hubConnectionState, error };
}