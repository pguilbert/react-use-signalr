import { HubConnection } from "@microsoft/signalr";
import { useCallback, useState } from "react";

const initialState = {
    loading: false,
}

export function useHubCallback(hubConnection: HubConnection, methodName: string) {
    const [state, setState] = useState(initialState);

    const invoke = useCallback(async (...args: any[]) => {
        setState(s => ({...s, loading: true}));
        try {
            return await hubConnection.invoke(methodName, ...args);
        }
        finally {
            setState(s => ({...s, loading: false}));
        }
    }, [hubConnection, methodName]);

    return { invoke, ...state };
}