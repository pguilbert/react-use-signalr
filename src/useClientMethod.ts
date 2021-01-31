import { HubConnection } from "@microsoft/signalr";
import { useEffect } from "react";

/**
 * Registers a handler that will be invoked when the hub method with the specified method name is invoked.
 * @param {HubConnection} hubConnection The signalR hub connection.
 * @param {string} methodName The name of the hub method to define.
 * @param {Function} method The handler that will be raised when the hub method is invoked.
 */
export function useClientMethod(hubConnection: HubConnection | undefined, methodName: string, method: (...args: any[]) => void) {
    useEffect(() => {
        if(!hubConnection) {
            return;
        }

        hubConnection.on(methodName, method);

        return () => {
            hubConnection.off(methodName, method);
        }

    }, [hubConnection, method, methodName]);
}