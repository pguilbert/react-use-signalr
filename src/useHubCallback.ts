import { HubConnection } from "@microsoft/signalr";
import { useCallback, useState } from "react";

type HubCallbackState<T = any> = {
    loading: boolean,
    data?: T,
    error?: any
}
const initialState : HubCallbackState = {
    loading: false
}

export function useHubCallback<T>(hubConnection: HubConnection, methodName: string) {
    const [state, setState] = useState<HubCallbackState<T>>(initialState);

    const invoke = useCallback(async (...args: any[]) => {
        setState(s => ({...s, loading: true}));

        try {
            const data = await hubConnection.invoke<T>(methodName, ...args);
            setState(s => ({...s, data: data, loading: false, error: undefined}));
            return data;
        }
        catch(e) {
            setState(s => ({...s, error: e, loading: false}));
        }
    }, [hubConnection, methodName]);

    return { invoke, ...state };
}